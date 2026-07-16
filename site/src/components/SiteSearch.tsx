import { useEffect } from 'react';
import { Command, type CommandItem } from '@ttqtt/liquid-glass-react';
import { COMPONENT_DOCS } from '../demos/registry';
import { useSiteLocale } from '../site-i18n';

export interface SiteSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  );
}

/**
 * Site-wide component search — dogfoods the library's own Command palette.
 * Press `/` (outside a field) to open, type to fuzzy-filter, Enter to jump.
 */
export function SiteSearch({ open, onOpenChange }: SiteSearchProps) {
  const locale = useSiteLocale();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !isEditableTarget(event.target)) {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onOpenChange]);

  const items: CommandItem[] = COMPONENT_DOCS.map((doc) => ({
    key: doc.slug,
    label: `${doc.name} · ${doc.title[locale]}`,
    keywords: [doc.name, doc.slug, doc.title['zh-CN'], doc.title['en-US'], doc.category[locale]],
    group: doc.category[locale],
    onRun: () => {
      window.location.hash = `#/components/${doc.slug}`;
    },
  }));

  return (
    <Command
      items={items}
      open={open}
      onOpenChange={onOpenChange}
      placeholder={locale === 'zh-CN' ? '搜索组件…' : 'Search components…'}
    />
  );
}
