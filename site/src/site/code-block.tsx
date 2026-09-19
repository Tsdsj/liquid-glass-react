import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { GlassButton, LibraryIcon } from '@ttqtt/liquid-glass-react';
import { tokenize } from './tokenize.js';

/** Colour comes from `code-*` classes in app.css, which read from the design tokens. */
function Highlighted({ code }: { code: string }) {
  const tokens = useMemo(() => tokenize(code), [code]);
  return <>{tokens.map((token, index) => token.kind === 'plain'
    ? token.text
    : <span key={index} className={`code-${token.kind}`}>{token.text}</span>)}</>;
}

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
    <pre><code>{children ?? <Highlighted code={code} />}</code></pre>
    <GlassButton className="code-copy" variant="gray" controlSize="small"
      aria-label={copied ? '已复制' : label} onClick={() => void copy()}>
      <LibraryIcon name={copied ? 'checkmark' : 'plus'} size={14} />
      <span>{copied ? '已复制' : '复制'}</span>
    </GlassButton>
  </div>;
}
