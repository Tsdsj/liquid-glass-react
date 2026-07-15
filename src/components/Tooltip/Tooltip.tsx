import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
  type Placement,
} from '@floating-ui/react';
import {
  cloneElement,
  forwardRef,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: Placement;
  delay?: number;
}

type TriggerProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };

const TOOLTIP_TRANSITION_DURATION = 350;

export const Tooltip = /* @__PURE__ */ forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, children, placement = 'top', delay = 300 },
  forwardedRef,
) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const middleware = useMemo(
    () => [offset(8), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
    [],
  );
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
    transform: false,
  });
  const hover = useHover(context, { delay: { open: delay, close: 0 }, move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);
  const { isMounted, status } = useTransitionStatus(context, {
    duration: TOOLTIP_TRANSITION_DURATION,
  });
  const trigger = children as ReactElement<TriggerProps>;
  const referenceRef = useMergeRefs([refs.setReference, trigger.props.ref]);
  const floatingRef = useMergeRefs([refs.setFloating, forwardedRef]);
  const triggerProps = getReferenceProps({
    ...trigger.props,
    ref: referenceRef,
  }) as TriggerProps;
  const floatingProps = getFloatingProps() as HTMLAttributes<HTMLDivElement>;

  return (
    <>
      {cloneElement(trigger, triggerProps)}
      {isMounted ? (
        <FloatingPortal>
          <div
            {...floatingProps}
            ref={floatingRef}
            className="lg-tooltip"
            style={floatingStyles}
            data-status={status}
          >
            <GlassSurface
              refraction="off"
              tint="var(--lg-tooltip-bg)"
              className="lg-tooltip__panel"
            >
              {content}
            </GlassSurface>
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="lg-tooltip__arrow"
            />
          </div>
        </FloatingPortal>
      ) : null}
    </>
  );
});
