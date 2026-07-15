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

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: number | string;
  title?: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  children: ReactNode;
}

interface DrawerPanelStyle extends CSSProperties {
  '--lg-r': string;
  '--lg-drawer-size'?: string;
}

// Structurally identical to Modal (floating-ui overlay + focus manager + scrim
// blur-in + first-frame refraction gating). Copied per the M11 abstraction
// constraint (< 30 lines of divergence) so Modal stays untouched.
const DRAWER_TRANSITION_DURATION = 350;

export const Drawer = /* @__PURE__ */ forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    open,
    onOpenChange,
    placement = 'right',
    size,
    title,
    footer,
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
    duration: DRAWER_TRANSITION_DURATION,
  });
  const floatingRef = useMergeRefs<HTMLElement>([
    refs.setFloating,
    forwardedRef as Ref<HTMLElement>,
  ]);
  const floatingProps = getFloatingProps({
    'aria-labelledby': title ? titleId : undefined,
    'aria-modal': true,
  }) as HTMLAttributes<HTMLElement>;

  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  const panelStyle: DrawerPanelStyle = {
    '--lg-r': 'var(--lg-radius-lg)',
    ...(sizeValue ? { '--lg-drawer-size': sizeValue } : {}),
  };

  return isMounted ? (
    <FloatingPortal>
      <FloatingOverlay lockScroll className="lg-drawer__overlay" data-status={status}>
        <FloatingFocusManager context={context} modal>
          <GlassSurface
            {...floatingProps}
            ref={floatingRef}
            refraction="auto"
            bezel={20}
            className="lg-drawer__panel"
            style={panelStyle}
            data-placement={placement}
            data-status={status}
          >
            <header className="lg-drawer__header">
              {title ? (
                <h2 id={titleId} className="lg-drawer__title">
                  {title}
                </h2>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="lg-drawer__close"
                aria-label={locale === 'en-US' ? 'Close' : '关闭'}
                onClick={() => onOpenChange(false)}
              >
                <span aria-hidden="true">{'×'}</span>
              </Button>
            </header>
            <ScrollEdge className="lg-drawer__body-scroll" viewportClassName="lg-drawer__body">
              {children}
            </ScrollEdge>
            {footer ? <footer className="lg-drawer__footer">{footer}</footer> : null}
          </GlassSurface>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  ) : null;
});
