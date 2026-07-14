import { forwardRef, useEffect, useState, type ReactNode } from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, fallback, size = 'md', shape = 'circle' },
  ref,
) {
  const [errored, setErrored] = useState(false);

  // A new src is a fresh load attempt, so clear any prior error.
  useEffect(() => {
    setErrored(false);
  }, [src]);

  const showImage = src != null && !errored;

  return (
    <span ref={ref} className="lg-avatar" data-size={size} data-shape={shape}>
      {showImage ? (
        <img
          className="lg-avatar__img"
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="lg-avatar__fallback" role="img" aria-label={alt}>
          {fallback}
        </span>
      )}
    </span>
  );
});
