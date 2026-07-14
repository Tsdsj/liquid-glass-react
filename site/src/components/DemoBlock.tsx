import { useState, type ReactNode } from 'react';
import { Button, GlassSurface, toast } from '@ttq/liquid-glass-react';
import { SITE_COPY, useT, type Bilingual } from '../site-i18n';
import { GRADIENT_WALLPAPER } from '../wallpaper';

export interface DemoBlockProps {
  title: Bilingual;
  description: Bilingual;
  code: string;
  children: ReactNode;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function DemoBlock({ title, description, code, children }: DemoBlockProps) {
  const t = useT();
  const [showCode, setShowCode] = useState(false);

  const handleCopy = async () => {
    const copied = await copyToClipboard(code);
    if (copied) {
      toast.success(t(SITE_COPY.copied));
    } else {
      toast.error(t(SITE_COPY.copyFailed));
    }
  };

  return (
    <GlassSurface className="site-demo" data-testid="demo-block">
      <div className="site-demo__stage" style={{ backgroundImage: GRADIENT_WALLPAPER }}>
        {children}
      </div>
      <div className="site-demo__meta">
        <div>
          <h3>{t(title)}</h3>
          <p>{t(description)}</p>
        </div>
        <div className="site-demo__actions">
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            {t(SITE_COPY.copyCode)}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowCode((value) => !value)}>
            {showCode ? t(SITE_COPY.hideCode) : t(SITE_COPY.showCode)}
          </Button>
        </div>
      </div>
      {showCode ? <pre className="site-code">{code.trim()}</pre> : null}
    </GlassSurface>
  );
}
