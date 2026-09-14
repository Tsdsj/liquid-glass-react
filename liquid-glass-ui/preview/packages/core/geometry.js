export const clamp = (x, low, high) => Math.max(low, Math.min(high, x));
function positive(x, name) {
    if (!Number.isFinite(x) || x <= 0 || x > 16384)
        throw new RangeError(`${name} must be finite, positive and at most 16384 CSS pixels`);
    return x;
}
/** Signed distance, negative inside a rounded rectangle, in CSS pixels. */
export function roundedRectDistance(x, y, w, h, r) {
    const radius = clamp(r, 0, Math.min(w, h) / 2);
    const qx = Math.abs(x - w / 2) - (w / 2 - radius);
    const qy = Math.abs(y - h / 2) - (h / 2 - radius);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
}
export function normalizedMapOptions(options) {
    const width = Math.round(positive(options.width, 'width') * 2) / 2;
    const height = Math.round(positive(options.height, 'height') * 2) / 2;
    const radius = options.radius ?? 18;
    const edge = options.edge ?? 16;
    if (!Number.isFinite(radius) || !Number.isFinite(edge))
        throw new RangeError('radius and edge must be finite');
    if (!Number.isFinite(options.maxResolution ?? 256))
        throw new RangeError('resolution must be finite');
    return { width: Math.max(.5, width), height: Math.max(.5, height), radius: clamp(radius, 0, Math.min(width, height) / 2),
        edge: clamp(edge, 1, Math.min(width, height) / 2 || 1), maxResolution: clamp(Math.floor(options.maxResolution ?? 256), 16, 512) };
}
export function displacementKey(options) {
    const o = normalizedMapOptions(options);
    return [o.width, o.height, o.radius, o.edge, o.maxResolution].join(':');
}
export function createDisplacementMap(options) {
    const o = normalizedMapOptions(options);
    const ratio = Math.min(1, o.maxResolution / Math.max(o.width, o.height), Math.sqrt(131072 / (o.width * o.height)));
    const width = Math.max(1, Math.floor(o.width * ratio));
    const height = Math.max(1, Math.floor(o.height * ratio));
    const data = new Uint8ClampedArray(width * height * 4);
    const distance = (x, y) => roundedRectDistance(x, y, o.width, o.height, o.radius);
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
            const px = (x + .5) / width * o.width, py = (y + .5) / height * o.height;
            const d = distance(px, py), i = (y * width + x) * 4;
            data[i] = 128;
            data[i + 1] = 128;
            data[i + 2] = 128;
            data[i + 3] = 255;
            if (d > 0 || d < -o.edge)
                continue;
            const nx = distance(px + .25, py) - distance(px - .25, py);
            const ny = distance(px, py + .25) - distance(px, py - .25);
            const length = Math.hypot(nx, ny) || 1;
            const weight = Math.pow(1 - clamp(-d / o.edge, 0, 1), 2);
            data[i] = Math.round(127.5 + nx / length * weight * 127.5);
            data[i + 1] = Math.round(127.5 + ny / length * weight * 127.5);
        }
    return { width, height, cssWidth: o.width, cssHeight: o.height, data };
}
/**
 * Polynomial smooth minimum of two signed distances: the union of two shapes with a liquid
 * fillet of blend radius `k` (CSS px) where they meet. Pure maths used to reason about droplet
 * fusion; the render path is an SVG goo filter, never a per-frame rasterisation.
 */
export function smoothUnion(d1, d2, k) {
    if (!Number.isFinite(d1) || !Number.isFinite(d2))
        throw new RangeError('distances must be finite');
    if (!Number.isFinite(k) || k <= 0)
        return Math.min(d1, d2);
    const h = clamp(.5 + .5 * (d2 - d1) / k, 0, 1);
    return d2 + (d1 - d2) * h - k * h * (1 - h);
}
