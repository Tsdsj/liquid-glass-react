import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceSpring, springAtRest, defaultSpring, createSpring } from '../../.tmp/core/spring.js';

const settle = (from, target, config = {}, maxSteps = 4000) => {
  let state = { value: from, velocity: 0 }, steps = 0;
  while (!springAtRest(state, target, config) && steps++ < maxSteps) state = advanceSpring(state, target, 1 / 120, config);
  return { state, steps };
};

test('a spring converges on its target', () => {
  const { state, steps } = settle(0, 100);
  assert(steps < 4000, 'should settle well inside the step budget');
  assert(Math.abs(state.value - 100) < defaultSpring.precision);
});

test('a spring already at its target does not move', () => {
  const state = advanceSpring({ value: 50, velocity: 0 }, 50, 1 / 60);
  assert.equal(state.value, 50);
  assert.equal(state.velocity, 0);
});

test('the default configuration overshoots slightly, which is the point', () => {
  let state = { value: 0, velocity: 0 }, peak = 0;
  for (let i = 0; i < 240; i++) { state = advanceSpring(state, 1, 1 / 120); peak = Math.max(peak, state.value); }
  assert(peak > 1, 'expected overshoot past the target');
  assert(peak < 1.3, 'overshoot should stay subtle, not bouncy');
});

test('raising damping removes the overshoot', () => {
  let state = { value: 0, velocity: 0 }, peak = 0;
  const config = { stiffness: 320, damping: 2 * Math.sqrt(320) };
  for (let i = 0; i < 240; i++) { state = advanceSpring(state, 1, 1 / 120, config); peak = Math.max(peak, state.value); }
  assert(peak <= 1 + 1e-9, `critically damped spring should not overshoot, peaked at ${peak}`);
});

test('a huge dt is clamped so a backgrounded tab cannot fling the value', () => {
  const clamped = advanceSpring({ value: 0, velocity: 0 }, 100, 10);
  const cap = advanceSpring({ value: 0, velocity: 0 }, 100, .032);
  assert.equal(clamped.value, cap.value);
});

test('a non-finite dt falls back to one frame instead of producing NaN', () => {
  const state = advanceSpring({ value: 0, velocity: 0 }, 100, Number.NaN);
  assert(Number.isFinite(state.value));
  assert(state.value > 0);
});

test('a negative dt does not run the spring backwards', () => {
  const state = advanceSpring({ value: 0, velocity: 0 }, 100, -1);
  assert.equal(state.value, 0);
  assert.equal(state.velocity, 0);
});

test('non-finite inputs are rejected rather than silently poisoning the loop', () => {
  assert.throws(() => advanceSpring({ value: Number.NaN, velocity: 0 }, 1, .016), RangeError);
  assert.throws(() => advanceSpring({ value: 0, velocity: Infinity }, 1, .016), RangeError);
  assert.throws(() => advanceSpring({ value: 0, velocity: 0 }, Number.NaN, .016), RangeError);
  assert.throws(() => advanceSpring({ value: 0, velocity: 0 }, 1, .016, { stiffness: 0 }), RangeError);
  assert.throws(() => advanceSpring({ value: 0, velocity: 0 }, 1, .016, { damping: -1 }), RangeError);
});

test('createSpring jumps immediately when there is no rAF (SSR / reduced motion)', () => {
  const seen = [];
  const spring = createSpring(0, value => seen.push(value));
  spring.to(42);
  assert.equal(spring.value, 42);
  assert.deepEqual(seen, [42]);
  spring.stop();
});

test('createSpring set() is an instant jump and clears velocity', () => {
  const seen = [];
  const spring = createSpring(10, value => seen.push(value));
  spring.set(3);
  assert.equal(spring.value, 3);
  assert.deepEqual(seen, [3]);
  assert.throws(() => spring.set(Number.NaN), RangeError);
});
