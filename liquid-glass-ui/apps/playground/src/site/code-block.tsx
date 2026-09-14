import { useEffect, useRef, useState, type ReactNode } from 'react';
import { GlassButton, LibraryIcon } from '@liquid-glass-ui/react';

export function CodeBlock({ code, label = '复制代码', children }: { code: string; label?: string; children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch { setCopied(false); }
  };
  return <div className="code-block">
    <pre><code>{children ?? code}</code></pre>
    <GlassButton className="code-copy" variant="gray" controlSize="small"
      aria-label={copied ? '已复制' : label} onClick={() => void copy()}>
      <LibraryIcon name={copied ? 'checkmark' : 'plus'} size={14} />
      <span>{copied ? '已复制' : '复制'}</span>
    </GlassButton>
  </div>;
}
