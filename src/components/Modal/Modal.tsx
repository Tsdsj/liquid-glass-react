import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react';
import {
  forwardRef,
  useId,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { Button } from '../Button';
import { GlassSurface } from '../../core/GlassSurface';
import { ScrollEdge } from '../../core/scroll-edge';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
  children: ReactNode;
}

interface ModalPanelStyle extends CSSProperties {
  '--lg-r': string;
}

const MODAL_TRANSITION_DURATION = 350;
const MODAL_PANEL_STYLE: ModalPanelStyle = {
  '--lg-r': 'var(--lg-radius-lg)',
};

export const Modal = /* @__PURE__ */ forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onOpenChange,
    title,
    footer,
    size = 'md',
    closeOnOverlayClick = true,
    children,
  },
  forwardedRef,
) {
  const { locale } = useLiquidGlassContext();
  const titleId = useId();
  const { refs, context } = useFloating({
    open,
    onOpenChange: (nextOpen) => onOpenChange(nextOpen),
    transform: false,
  });
  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePress: closeOnOverlayClick,
  });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);
  const { isMounted, status } = useTransitionStatus(context, {
    duration: MODAL_TRANSITION_DURATION,
  });
  const floatingRef = useMergeRefs<HTMLElement>([
    refs.setFloating,
    forwardedRef as Ref<HTMLElement>,
  ]);
  const floatingProps = getFloatingProps({
    'aria-labelledby': title ? titleId : undefined,
    'aria-modal': true,
  }) as HTMLAttributes<HTMLElement>;

  return isMounted ? (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        className="lg-modal__overlay"
        data-status={status}
      >
        <FloatingFocusManager context={context} modal>
          <GlassSurface
            {...floatingProps}
            ref={floatingRef}
            refraction="auto"
            bezel={20}
            className="lg-modal__panel"
            style={MODAL_PANEL_STYLE}
            data-size={size}
            data-status={status}
          >
            <header className="lg-modal__header">
              {title ? (
                <h2 id={titleId} className="lg-modal__title">
                  {title}
                </h2>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="lg-modal__close"
                aria-label={locale === 'en-US' ? 'Close' : '关闭'}
                onClick={() => onOpenChange(false)}
              >
                <span aria-hidden="true">{'\u00d7'}</span>
              </Button>
            </header>
            <ScrollEdge className="lg-modal__body-scroll" viewportClassName="lg-modal__body">
              {children}
            </ScrollEdge>
            {footer ? <footer className="lg-modal__footer">{footer}</footer> : null}
          </GlassSurface>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  ) : null;
});
