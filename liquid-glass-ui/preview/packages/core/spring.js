export const defaultSpring = { stiffness: 320, damping: 22, precision: .05, restVelocity: .5 };
function finite(x, name) {
    if (!Number.isFinite(x))
        throw new RangeError(`${name} must be finite`);
    return x;
}
/**
 * Advance one step. `dt` is seconds and is clamped to 32ms so a backgrounded tab
 * resuming cannot integrate a single huge step and fling the value.
 */
export function advanceSpring(state, target, dt, config = {}) {
    const { stiffness, damping } = { ...defaultSpring, ...config };
    finite(state.value, 'value');
    finite(state.velocity, 'velocity');
    finite(target, 'target');
    if (!Number.isFinite(stiffness) || stiffness <= 0)
        throw new RangeError('stiffness must be positive and finite');
    if (!Number.isFinite(damping) || damping < 0)
        throw new RangeError('damping must be nonnegative and finite');
    const step = Math.max(0, Math.min(.032, Number.isFinite(dt) ? dt : .016));
    const acceleration = (target - state.value) * stiffness - state.velocity * damping;
    const velocity = state.velocity + acceleration * step;
    return { value: state.value + velocity * step, velocity };
}
/** True once the spring is close enough to its target to snap and stop the loop. */
export function springAtRest(state, target, config = {}) {
    const { precision, restVelocity } = { ...defaultSpring, ...config };
    return Math.abs(target - state.value) < precision && Math.abs(state.velocity) < restVelocity;
}
/**
 * rAF-driven spring. `apply` receives every intermediate value. Call on the client
 * only; without `requestAnimationFrame` it degrades to an immediate jump so SSR and
 * reduced-motion paths stay correct.
 */
export function createSpring(initial, apply, config = {}) {
    let state = { value: finite(initial, 'initial'), velocity: 0 };
    let target = initial, frame = 0, last = 0;
    const animated = typeof requestAnimationFrame === 'function';
    const stop = () => { if (frame)
        cancelAnimationFrame(frame); frame = 0; last = 0; };
    const step = (now) => {
        const dt = last ? (now - last) / 1000 : .016;
        last = now;
        state = advanceSpring(state, target, dt, config);
        if (springAtRest(state, target, config)) {
            state = { value: target, velocity: 0 };
            apply(state.value);
            stop();
            return;
        }
        apply(state.value);
        frame = requestAnimationFrame(step);
    };
    return {
        to(next) {
            target = finite(next, 'target');
            if (!animated) {
                state = { value: target, velocity: 0 };
                apply(target);
                return;
            }
            if (!frame) {
                last = 0;
                frame = requestAnimationFrame(step);
            }
        },
        set(value) { stop(); state = { value: finite(value, 'value'), velocity: 0 }; target = state.value; apply(state.value); },
        stop,
        get value() { return state.value; },
    };
}
