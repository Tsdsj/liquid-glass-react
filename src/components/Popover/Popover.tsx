import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
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
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';

export interface PopoverProps {
  content: ReactNode;
  children: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  showArrow?: boolean;
}

type TriggerProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
  'data-expanded'?: string;
};

const POPOVER_TRANSITION_DURATION = 350;

export const Popover = /* @__PURE__ */ forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    content,
    children,
    open,
    defaultOpen = false,
    onOpenChange,
    placement = 'bottom',
    showArrow = true,
  },
  forwardedRef,
) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const middleware = useMemo(
    () => [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      ...(showArrow ? [arrow({ element: arrowRef })] : []),
    ],
    [showArrow],
  );
  const { refs, floatingStyles, context, placement: resolvedPlacement } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
    transform: false,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);
  const { isMounted, status } = useTransitionStatus(context, {
    duration: POPOVER_TRANSITION_DURATION,
  });
  const trigger = children as ReactElement<TriggerProps>;
  const referenceRef = useMergeRefs([refs.setReference, trigger.props.ref]);
  const floatingRef = useMergeRefs([refs.setFloating, forwardedRef]);
  const triggerProps = {
    ...getReferenceProps({
      ...trigger.props,
      ref: referenceRef,
    }),
    'data-expanded': isOpen ? '' : undefined,
  } as TriggerProps;
  const floatingProps = getFloatingProps() as HTMLAttributes<HTMLDivElement>;

  return (
    <>
      {cloneElement(trigger, triggerProps)}
      {isMounted ? (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              {...floatingProps}
              ref={floatingRef}
              className="lg-popover"
              style={floatingStyles}
              data-status={status}
              data-placement={resolvedPlacement}
            >
              <GlassSurface refraction="auto" bezel={16} className="lg-popover__panel">
                {content}
              </GlassSurface>
              {showArrow ? (
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  className="lg-popover__arrow"
                />
              ) : null}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
});
