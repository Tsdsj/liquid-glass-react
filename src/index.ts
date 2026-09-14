'use client';
/**
 * Public entry point for @ttqtt/liquid-glass-react.
 *
 * Remember to load the stylesheet once, anywhere in your app:
 *   import '@ttqtt/liquid-glass-react/style.css';
 */
export * from './react/index.js';

/**
 * The design constants the components themselves are built from. Read them when you need to
 * stay in step with the system — the type scale, the spacing grid, the spring timings — rather
 * than re-deriving numbers that would then drift.
 */
export {
  materialTokens, densityTokens, motionTokens, spacingTokens,
  radiusTokens, textStyles, textScale, zIndexTokens, defaultPolicy,
} from './tokens/index.js';
