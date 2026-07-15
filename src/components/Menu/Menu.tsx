import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTransitionStatus,
  useTypeahead,
  type Placement,
} from '@floating-ui/react';
import {
  cloneElement,
  forwardRef,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { ScrollEdge } from '../../core/scroll-edge';
import { useControllableState } from '../../core/hooks/useControllableState';

export type MenuItem =
  | { key: string; label: ReactNode; icon?: ReactNode; disabled?: boolean; danger?: boolean }
  | { type: 'divider' };

type MenuActionItem = Exclude<MenuItem, { type: 'divider' }>;

export interface MenuProps {
  items: MenuItem[];
  onSelect?: (key: string) => void;
  children: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
}

type TriggerProps = HTMLAttributes<HTMLElement> & {
  ref?: Ref<HTMLElement>;
  'data-expanded'?: string;
};

const MENU_TRANSITION_DURATION = 350;

function isDivider(item: MenuItem): item is { type: 'divider' } {
  return 'type' in item && item.type === 'divider';
}

function getItemText(label: ReactNode): string | null {
  if (typeof label === 'string' || typeof label === 'number') {
    return String(label);
  }
  return null;
}

export const Menu = /* @__PURE__ */ forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { items, onSelect, children, open, defaultOpen = false, onOpenChange, placement = 'bottom-start' },
  forwardedRef,
) {
  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const actionItems = useMemo(
    () => items.filter((item): item is MenuActionItem => !isDivider(item)),
    [items],
  );
  listRef.current.length = actionItems.length;
  labelsRef.current = actionItems.map((item) => getItemText(item.label));
  const disabledIndices = actionItems.flatMap((item, index) => (item.disabled ? [index] : []));

  const { refs, floatingStyles, context, placement: resolvedPlacement } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.max(0, availableHeight)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
    transform: false,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    disabledIndices,
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: isOpen ? setActiveIndex : undefined,
    enabled: isOpen,
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
    typeahead,
  ]);
  const { isMounted, status } = useTransitionStatus(context, {
    duration: MENU_TRANSITION_DURATION,
  });

  const trigger = children as ReactElement<TriggerProps>;
  const referenceRef = useMergeRefs([refs.setReference, trigger.props.ref]);
  const floatingRef = useMergeRefs([refs.setFloating, forwardedRef]);
  const triggerProps = {
    ...getReferenceProps({ ...trigger.props, ref: referenceRef }),
    'data-expanded': isOpen ? '' : undefined,
  } as TriggerProps;
  const floatingProps = getFloatingProps() as HTMLAttributes<HTMLElement>;

  const selectItem = (item: MenuActionItem) => {
    if (item.disabled) {
      return;
    }
    onSelect?.(item.key);
    setIsOpen(false);
    setActiveIndex(null);
  };

  let actionIndex = -1;

  return (
    <>
      {cloneElement(trigger, triggerProps)}
      {isMounted ? (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <GlassSurface
              {...floatingProps}
              ref={floatingRef as Ref<HTMLElement>}
              refraction="auto"
              bezel={16}
              className="lg-menu__panel"
              style={floatingStyles}
              data-status={status}
              data-placement={resolvedPlacement}
            >
              <ScrollEdge className="lg-menu__scroll" viewportClassName="lg-menu__viewport">
                {items.map((item, index) => {
                  if (isDivider(item)) {
                    return <div key={`divider-${index}`} role="separator" className="lg-menu__divider" />;
                  }

                  actionIndex += 1;
                  const itemIndex = actionIndex;
                  const itemProps = getItemProps({
                    onClick: () => selectItem(item),
                    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        selectItem(item);
                      }
                    },
                  }) as HTMLAttributes<HTMLDivElement>;

                  return (
                    <div
                      {...itemProps}
                      key={item.key}
                      ref={(element) => {
                        listRef.current[itemIndex] = element;
                      }}
                      role="menuitem"
                      tabIndex={activeIndex === itemIndex ? 0 : -1}
                      aria-disabled={item.disabled || undefined}
                      className="lg-menu__item"
                      data-active={activeIndex === itemIndex ? '' : undefined}
                      data-disabled={item.disabled ? '' : undefined}
                      data-danger={item.danger ? '' : undefined}
                    >
                      {item.icon != null ? (
                        <span className="lg-menu__icon" aria-hidden="true">
                          {item.icon}
                        </span>
                      ) : null}
                      <span className="lg-menu__label">{item.label}</span>
                    </div>
                  );
                })}
              </ScrollEdge>
            </GlassSurface>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
});
