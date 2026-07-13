const MAP_SCALE = 0.5;
const MAX_CACHE_ENTRIES = 50;

const displacementMapCache = new Map<string, string>();

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function roundedRectSDF(
  px: number,
  py: number,
  width: number,
  height: number,
  radius: number,
): number {
  const qx = Math.abs(px - width / 2) - (width / 2 - radius);
  const qy = Math.abs(py - height / 2) - (height / 2 - radius);

  return (
    Math.min(Math.max(qx, qy), 0) +
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) -
    radius
  );
}

function setNeutralPixel(pixels: Uint8ClampedArray, offset: number): void {
  pixels[offset] = 128;
  pixels[offset + 1] = 128;
  pixels[offset + 2] = 128;
  pixels[offset + 3] = 255;
}

/** Pure pixel calculation that does not require a DOM or canvas. */
export function computeDisplacementPixels(
  w: number,
  h: number,
  r: number,
  bezel: number,
): Uint8ClampedArray {
  const width = Math.max(1, Math.round(w));
  const height = Math.max(1, Math.round(h));
  const radius = Math.min(Math.max(0, r), Math.min(width, height) / 2);
  const bezelWidth = Math.max(Number.EPSILON, bezel);
  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const px = x + 0.5;
      const py = y + 0.5;
      const distance = roundedRectSDF(px, py, width, height, radius);
      const t = clamp01(1 + distance / bezelWidth);

      if (t === 0) {
        setNeutralPixel(pixels, offset);
        continue;
      }

      const gradientX =
        roundedRectSDF(px + 1, py, width, height, radius) -
        roundedRectSDF(px - 1, py, width, height, radius);
      const gradientY =
        roundedRectSDF(px, py + 1, width, height, radius) -
        roundedRectSDF(px, py - 1, width, height, radius);
      const gradientLength = Math.hypot(gradientX, gradientY);
      const normalX = gradientLength === 0 ? 0 : gradientX / gradientLength;
      const normalY = gradientLength === 0 ? 0 : gradientY / gradientLength;
      const lens = 1 - Math.sqrt(Math.max(0, 1 - t * t));

      pixels[offset] = Math.round(128 - normalX * lens * 127);
      pixels[offset + 1] = Math.round(128 - normalY * lens * 127);
      pixels[offset + 2] = 128;
      pixels[offset + 3] = 255;
    }
  }

  return pixels;
}

function writePixels(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): void {
  const imageData = context.createImageData(width, height);
  imageData.data.set(pixels);
  context.putImageData(imageData, 0, 0);
}

function encodeOffscreenCanvas(canvas: OffscreenCanvas, width: number, height: number): string {
  const syncCanvas = canvas as OffscreenCanvas & { toDataURL?: (type?: string) => string };
  if (typeof syncCanvas.toDataURL === 'function') {
    return syncCanvas.toDataURL('image/png');
  }

  if (typeof document === 'undefined') {
    throw new Error('A DOM canvas is required to encode an OffscreenCanvas as a data URI.');
  }

  const output = document.createElement('canvas');
  output.width = width;
  output.height = height;
  const outputContext = output.getContext('2d');
  if (!outputContext) {
    throw new Error('Unable to create a 2D canvas context for the displacement map.');
  }

  outputContext.drawImage(canvas, 0, 0);
  return output.toDataURL('image/png');
}

function renderDisplacementMap(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): string {
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to create an OffscreenCanvas 2D context for the displacement map.');
    }

    writePixels(context, pixels, width, height);
    return encodeOffscreenCanvas(canvas, width, height);
  }

  if (typeof document === 'undefined') {
    throw new Error('A canvas implementation is required to create a displacement map.');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to create a 2D canvas context for the displacement map.');
  }

  writePixels(context, pixels, width, height);
  return canvas.toDataURL('image/png');
}

function readCachedMap(key: string): string | undefined {
  const cached = displacementMapCache.get(key);
  if (cached === undefined) {
    return undefined;
  }

  displacementMapCache.delete(key);
  displacementMapCache.set(key, cached);
  return cached;
}

function cacheMap(key: string, value: string): void {
  displacementMapCache.set(key, value);
  if (displacementMapCache.size <= MAX_CACHE_ENTRIES) {
    return;
  }

  const oldestKey = displacementMapCache.keys().next().value;
  if (oldestKey !== undefined) {
    displacementMapCache.delete(oldestKey);
  }
}

/** Creates a half-resolution PNG data URI for an element-sized rounded rectangle. */
export function makeDisplacementMap(w: number, h: number, r: number, bezel: number): string {
  const width = Math.max(1, Math.round(w * MAP_SCALE));
  const height = Math.max(1, Math.round(h * MAP_SCALE));
  const radius = Math.max(0, Math.round(r * MAP_SCALE));
  const bezelWidth = Math.max(1, Math.round(bezel * MAP_SCALE));
  const key = `${width},${height},${radius},${bezelWidth}`;
  const cached = readCachedMap(key);

  if (cached !== undefined) {
    return cached;
  }

  const pixels = computeDisplacementPixels(width, height, radius, bezelWidth);
  const dataURI = renderDisplacementMap(pixels, width, height);
  cacheMap(key, dataURI);
  return dataURI;
}

export function __resetDisplacementMapCache(): void {
  displacementMapCache.clear();
}
