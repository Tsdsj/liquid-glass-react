import { useId, type ReactNode } from 'react';
import { useControllableState } from '../../core/hooks/useControllableState';

export interface AccordionItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (keys: string[]) => void;
}

export function Accordion({
  items,
  multiple = false,
  value,
  defaultValue,
  onChange,
}: AccordionProps) {
  const baseId = useId();
  const [openKeys, setOpenKeys] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });

  const toggle = (key: string) => {
    const isOpen = openKeys.includes(key);
    if (multiple) {
      setOpenKeys(isOpen ? openKeys.filter((k) => k !== key) : [...openKeys, key]);
    } else {
      setOpenKeys(isOpen ? [] : [key]);
    }
  };

  return (
    <div className="lg-accordion">
      {items.map((item) => {
        const expanded = openKeys.includes(item.key);
        const headerId = `${baseId}-${item.key}-header`;
        const panelId = `${baseId}-${item.key}-panel`;
        return (
          <div key={item.key} className="lg-accordion__item">
            <h3 className="lg-accordion__heading">
              <button
                type="button"
                id={headerId}
                className="lg-accordion__trigger"
                aria-expanded={expanded}
                aria-controls={panelId}
                disabled={item.disabled}
                data-expanded={expanded ? '' : undefined}
                onClick={() => toggle(item.key)}
              >
                <span className="lg-accordion__title">{item.title}</span>
                <span className="lg-accordion__arrow" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="lg-accordion__panel"
              data-expanded={expanded ? '' : undefined}
            >
              <div className="lg-accordion__content">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
