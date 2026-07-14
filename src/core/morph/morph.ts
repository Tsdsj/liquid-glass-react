export interface MorphFrame {
  transform: string;
  borderRadius: string;
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function round(value: number): number {
  return Math.round(value * 1e3) / 1e3;
}

/**
 * L0 morph: keyframes for one GlassSurface transitioning between two laid-out
 * positions. The element stays at `from`; each frame carries a transform
 * (translate + scale) plus the interpolated border-radius toward `to`.
 *
 * Only transform + border-radius change — never offsetWidth/Height — so the
 * refraction filter shape is never rebuilt mid-flight (the M13 lock-shape
 * requirement is structural, not enforced here).
 */
export function computeMorphFrames(
  from: DOMRect,
  to: DOMRect,
  fromRadius: number,
  toRadius: number,
  steps = 2,
): MorphFrame[] {
  const count = Math.max(2, Math.round(steps));
  const dx = to.left - from.left;
  const dy = to.top - from.top;
  const scaleX = from.width === 0 ? 1 : to.width / from.width;
  const scaleY = from.height === 0 ? 1 : to.height / from.height;

  const frames: MorphFrame[] = [];
  for (let index = 0; index < count; index += 1) {
    const t = index / (count - 1);
    const x = round(lerp(0, dx, t));
    const y = round(lerp(0, dy, t));
    const sx = round(lerp(1, scaleX, t));
    const sy = round(lerp(1, scaleY, t));
    const radius = round(lerp(fromRadius, toRadius, t));
    frames.push({
      transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`,
      borderRadius: `${radius}px`,
    });
  }
  return frames;
}
