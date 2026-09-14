import test from 'node:test';
import assert from 'node:assert/strict';
import { concentricRadius, concentricInset, capsuleRadius } from '../../.tmp/core/concentric.js';

test('inner radius is the container radius minus the padding', () => {
  assert.equal(concentricRadius(26, 12), 14);
  assert.equal(concentricRadius(38, 8), 30);
});

test('a child flush with the container keeps the container radius', () => {
  assert.equal(concentricRadius(26, 0), 26);
});

test('padding wider than the radius collapses to a square corner, not a negative one', () => {
  assert.equal(concentricRadius(12, 40), 0);
});

test('a standalone component falls back to its minimum radius', () => {
  assert.equal(concentricRadius(12, 40, { minimum: 12 }), 12);
  assert.equal(concentricRadius(26, 12, { minimum: 12 }), 14);
});

test('maximum clamps the radius to half the shorter side', () => {
  assert.equal(concentricRadius(80, 4, { maximum: 22 }), 22);
});

test('minimum wins when it exceeds the maximum-bounded result only if consistent', () => {
  assert.equal(concentricRadius(2, 40, { minimum: 10, maximum: 20 }), 10);
  assert.throws(() => concentricRadius(20, 4, { minimum: 20, maximum: 10 }), RangeError);
});

test('inputs must be finite and nonnegative', () => {
  assert.throws(() => concentricRadius(Number.NaN, 4), RangeError);
  assert.throws(() => concentricRadius(20, -1), RangeError);
  assert.throws(() => concentricRadius(-20, 4), RangeError);
});

test('concentricInset is the inverse of concentricRadius', () => {
  assert.equal(concentricInset(26, 14), 12);
  assert.equal(concentricRadius(26, concentricInset(26, 14)), 14);
});

test('concentricInset never reports a negative padding', () => {
  assert.equal(concentricInset(10, 40), 0);
});

test('capsule radius is exactly half the control height', () => {
  assert.equal(capsuleRadius(44), 22);
  assert.equal(capsuleRadius(36), 18);
  assert.throws(() => capsuleRadius(-1), RangeError);
});
