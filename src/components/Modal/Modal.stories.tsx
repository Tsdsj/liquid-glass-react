import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState, type ButtonHTMLAttributes } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Modal, type ModalProps } from './Modal';

const COPY = {
  'zh-CN': {
    open: '打开弹窗',
    title: '确认设置',
    body: '请检查这些设置，确认无误后再继续。',
    cancel: '取消',
    confirm: '确认',
    sizes: { sm: '小尺寸', md: '中尺寸', lg: '大尺寸' },
    dismissible: '点击遮罩可关闭',
    persistent: '点击遮罩不关闭',
    formTitle: '编辑资料',
    name: '姓名',
    email: '邮箱',
    save: '保存',
  },
  'en-US': {
    open: 'Open modal',
    title: 'Confirm settings',
    body: 'Review these settings before continuing.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    sizes: { sm: 'Small', md: 'Medium', lg: 'Large' },
    dismissible: 'Overlay closes',
    persistent: 'Overlay stays open',
    formTitle: 'Edit profile',
    name: 'Name',
    email: 'Email',
    save: 'Save',
  },
} as const;

const BUTTON_STYLE = {
  minHeight: 'var(--lg-control-h-md)',
  padding: '0 var(--lg-space-3)',
  border: '1px solid var(--lg-highlight)',
  borderRadius: 'var(--lg-radius-full)',
  color: 'var(--lg-text)',
  background: 'var(--lg-tint)',
  cursor: 'pointer',
  font: 'inherit',
} as const;

const INPUT_STYLE = {
  minHeight: 'var(--lg-control-h-md)',
  boxSizing: 'border-box',
  padding: '0 var(--lg-space-3)',
  border: '1px solid var(--lg-highlight)',
  borderRadius: 'var(--lg-radius-sm)',
  color: 'var(--lg-text)',
  background: 'var(--lg-tint)',
  font: 'inherit',
} as const;

function StoryButton({ children, style, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} type="button" style={{ ...BUTTON_STYLE, ...style }}>
      {children}
    </button>
  );
}

function LocalizedPlayground(props: ModalProps) {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    props.onOpenChange(nextOpen);
  };

  return (
    <>
      <StoryButton onClick={() => handleOpenChange(true)}>{copy.open}</StoryButton>
      <Modal
        {...props}
        open={open}
        onOpenChange={handleOpenChange}
        title={props.title ?? copy.title}
        footer={
          props.footer ?? (
            <>
              <StoryButton onClick={() => handleOpenChange(false)}>{copy.cancel}</StoryButton>
              <StoryButton onClick={() => handleOpenChange(false)}>{copy.confirm}</StoryButton>
            </>
          )
        }
      >
        {props.children ?? copy.body}
      </Modal>
    </>
  );
}

function ModalVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--lg-space-3)', flexWrap: 'wrap' }}>
        {(['sm', 'md', 'lg'] as const).map((value) => (
          <StoryButton key={value} onClick={() => setSize(value)}>
            {copy.sizes[value]}
          </StoryButton>
        ))}
      </div>
      <Modal
        open={size !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setSize(null);
        }}
        size={size ?? 'md'}
        title={size ? copy.sizes[size] : copy.title}
      >
        {copy.body}
      </Modal>
    </>
  );
}

function ModalStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [mode, setMode] = useState<'dismissible' | 'persistent' | null>(null);
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--lg-space-3)', flexWrap: 'wrap' }}>
        <StoryButton onClick={() => setMode('dismissible')}>{copy.dismissible}</StoryButton>
        <StoryButton onClick={() => setMode('persistent')}>{copy.persistent}</StoryButton>
      </div>
      <Modal
        open={mode !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setMode(null);
        }}
        title={copy.title}
        closeOnOverlayClick={mode !== 'persistent'}
      >
        {copy.body}
      </Modal>
    </>
  );
}

function FormScenario() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [open, setOpen] = useState(false);
  return (
    <>
      <StoryButton onClick={() => setOpen(true)}>{copy.formTitle}</StoryButton>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={copy.formTitle}
        footer={<StoryButton onClick={() => setOpen(false)}>{copy.save}</StoryButton>}
      >
        <form style={{ display: 'grid', gap: 'var(--lg-space-3)' }}>
          <label style={{ display: 'grid', gap: 'var(--lg-space-1)' }}>
            <span>{copy.name}</span>
            <input style={INPUT_STYLE} />
          </label>
          <label style={{ display: 'grid', gap: 'var(--lg-space-1)' }}>
            <span>{copy.email}</span>
            <input type="email" style={INPUT_STYLE} />
          </label>
        </form>
      </Modal>
    </>
  );
}

const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    open: false,
    onOpenChange: () => undefined,
    title: null,
    footer: null,
    size: 'md',
    closeOnOverlayClick: true,
    children: null,
  },
  argTypes: {
    title: { control: false },
    footer: { control: false },
    children: { control: false },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <ModalVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <ModalStates />,
  parameters: { controls: { disable: true } },
};

export const Form: Story = {
  render: () => <FormScenario />,
  parameters: { controls: { disable: true } },
};
