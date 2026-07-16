import type { ReactNode } from 'react';
import { Button, type ButtonProps } from '../Button';
import { Menu, type MenuItem } from '../Menu';

export interface DropdownProps {
  /** Menu entries — same shape as Menu's items (dividers, danger, disabled…). */
  items: MenuItem[];
  onSelect?: (key: string) => void;
  /** Built-in trigger button label. */
  label: ReactNode;
  variant?: ButtonProps['variant'];
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

/**
 * A thin composition: a Button trigger (with a caret) driving a Menu. Keyboard
 * model, focus management and a11y all come from Menu — nothing is re-implemented.
 */
export function Dropdown({
  items,
  onSelect,
  label,
  variant = 'glass',
  size = 'md',
  disabled = false,
}: DropdownProps) {
  return (
    <Menu items={items} onSelect={onSelect}>
      <Button variant={variant} size={size} disabled={disabled} className="lg-dropdown__trigger">
        {label}
        <span className="lg-dropdown__caret" aria-hidden="true" />
      </Button>
    </Menu>
  );
}
