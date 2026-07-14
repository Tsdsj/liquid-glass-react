import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './components/Modal';
import { Select } from './components/Select';
import { useLiquidGlassContext } from './core/config/LiquidGlassConfig';

const COPY = {
  'zh-CN': {
    intro:
      '内部滚动区滚到边缘时，内容不再生硬截断，而是在控件下方逐渐模糊、降透明，保护可读性。',
    modalTitle: '长内容对话框',
    modalOpen: '打开长内容对话框',
    selectLabel: '很多选项的下拉框',
    paragraphs: Array.from(
      { length: 40 },
      (_, index) => `第 ${index + 1} 段：滚动到头部或底部时，观察 header/footer 附近内容的渐进模糊淡出效果。`,
    ),
    option: (index: number) => `选项 ${index + 1}`,
  },
  'en-US': {
    intro:
      'When an internal scroll region reaches an edge, content no longer clips abruptly — it blurs and fades beneath the controls to protect legibility.',
    modalTitle: 'Long content dialog',
    modalOpen: 'Open long content dialog',
    selectLabel: 'Select with many options',
    paragraphs: Array.from(
      { length: 40 },
      (_, index) => `Paragraph ${index + 1}: scroll to the top or bottom and watch content near the header/footer blur and fade.`,
    ),
    option: (index: number) => `Option ${index + 1}`,
  },
} as const;

const LAYOUT_STYLE: CSSProperties = {
  display: 'grid',
  gap: '24px',
  maxWidth: '520px',
  fontFamily: 'var(--lg-font)',
  color: 'var(--lg-text)',
};

const CAPTION_STYLE: CSSProperties = {
  margin: 0,
  color: 'var(--lg-text-secondary)',
  fontSize: 'var(--lg-font-size-sm)',
};

const TRIGGER_STYLE: CSSProperties = {
  justifySelf: 'start',
  padding: '10px 18px',
  border: '1px solid var(--lg-highlight)',
  borderRadius: 'var(--lg-radius-full)',
  background: 'var(--lg-tint)',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer',
};

function ScrollEdgeStory() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [open, setOpen] = useState(false);
  const options = Array.from({ length: 30 }, (_, index) => ({
    value: `option-${index + 1}`,
    label: copy.option(index),
  }));

  return (
    <section style={LAYOUT_STYLE}>
      <p style={CAPTION_STYLE}>{copy.intro}</p>

      <Select options={options} aria-label={copy.selectLabel} />

      <button type="button" style={TRIGGER_STYLE} onClick={() => setOpen(true)}>
        {copy.modalOpen}
      </button>

      <Modal open={open} onOpenChange={setOpen} title={copy.modalTitle}>
        {copy.paragraphs.map((paragraph, index) => (
          <p key={index} style={{ margin: '0 0 16px' }}>
            {paragraph}
          </p>
        ))}
      </Modal>
    </section>
  );
}

const meta = {
  title: 'Visual/ScrollEdge',
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ScrollEdge: Story = {
  render: () => <ScrollEdgeStory />,
  globals: {
    theme: 'light',
    wallpaper: 'photo',
  },
};
