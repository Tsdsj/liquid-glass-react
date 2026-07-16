import { useRef, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { Button } from '../Button';
import { Modal } from './Modal';

export interface ConfirmOptions {
  title?: ReactNode;
  content?: ReactNode;
  okText?: ReactNode;
  cancelText?: ReactNode;
  /** Style the confirm button as a destructive action. */
  danger?: boolean;
  /** Imperative calls cannot read the React context — pass the locale explicitly. */
  locale?: 'zh-CN' | 'en-US';
}

const COPY = {
  'zh-CN': { ok: '确定', cancel: '取消' },
  'en-US': { ok: 'OK', cancel: 'Cancel' },
} as const;

// Modal's exit transition; the throwaway root lives until the glass finishes
// leaving, then unmounts.
const TEARDOWN_DELAY = 400;

function ConfirmDialog({
  options,
  onResolve,
}: {
  options: ConfirmOptions;
  onResolve: (result: boolean) => void;
}) {
  const locale = options.locale ?? 'zh-CN';
  const copy = COPY[locale];
  const [open, setOpen] = useState(true);
  const resolvedRef = useRef(false);

  const settle = (result: boolean) => {
    if (resolvedRef.current) {
      return;
    }
    resolvedRef.current = true;
    setOpen(false);
    onResolve(result);
  };

  return (
    <LiquidGlassConfig locale={locale}>
      <Modal
        open={open}
        // Escape / overlay / the built-in close button all land here.
        onOpenChange={(next) => {
          if (!next) {
            settle(false);
          }
        }}
        title={options.title}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => settle(false)}>
              {options.cancelText ?? copy.cancel}
            </Button>
            <Button variant={options.danger ? 'danger' : 'accent'} onClick={() => settle(true)}>
              {options.okText ?? copy.ok}
            </Button>
          </>
        }
      >
        {options.content}
      </Modal>
    </LiquidGlassConfig>
  );
}

/**
 * Imperative confirmation dialog: `Modal.confirm({...})` resolves `true` on
 * confirm, `false` on cancel / Escape / overlay press. Renders into its own
 * throwaway root, so concurrent calls stack independently.
 */
export function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  // SSR guard: there is nothing to confirm on the server.
  if (typeof document === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const host = document.createElement('div');
    host.className = 'lg-modal-confirm-host';
    document.body.appendChild(host);
    const root = createRoot(host);

    const teardown = () => {
      root.unmount();
      host.remove();
    };

    root.render(
      <ConfirmDialog
        options={options}
        onResolve={(result) => {
          resolve(result);
          window.setTimeout(teardown, TEARDOWN_DELAY);
        }}
      />,
    );
  });
}
