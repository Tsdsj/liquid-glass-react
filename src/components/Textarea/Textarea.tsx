import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ForwardedRef,
  type InputEvent,
  type MouseEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { cx } from '../../core/utils/cx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  autoResize?: boolean;
}

function assignRef(ref: ForwardedRef<HTMLTextAreaElement>, value: HTMLTextAreaElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function resizeTextarea(element: HTMLTextAreaElement): void {
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
}

export const Textarea = /* @__PURE__ */ forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    invalid = false,
    autoResize = false,
    className,
    style,
    disabled,
    value,
    onInput,
    ...rest
  },
  forwardedRef,
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const setTextareaRef = useCallback(
    (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      assignRef(forwardedRef, element);
    },
    [forwardedRef],
  );

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    if (autoResize) {
      resizeTextarea(element);
    } else {
      element.style.removeProperty('height');
    }
  }, [autoResize, value]);

  const handleContainerClick = (event: MouseEvent<HTMLElement>) => {
    if (!disabled && event.target !== textareaRef.current) {
      textareaRef.current?.focus();
    }
  };
  const handleInput = (event: InputEvent<HTMLTextAreaElement>) => {
    if (autoResize) {
      resizeTextarea(event.currentTarget);
    }
    onInput?.(event);
  };

  return (
    <GlassSurface
      refraction="off"
      className={cx('lg-textarea', className)}
      style={style}
      data-invalid={invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-auto-resize={autoResize ? '' : undefined}
      onClick={handleContainerClick}
    >
      <textarea
        {...rest}
        ref={setTextareaRef}
        value={value}
        disabled={disabled}
        aria-invalid={invalid ? true : rest['aria-invalid']}
        onInput={handleInput}
        className="lg-textarea__el"
      />
    </GlassSurface>
  );
});
