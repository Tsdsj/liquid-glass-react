import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Segmented } from './Segmented';

const COPY = {
  'zh-CN': { label: '时间范围', day: '日', week: '周', month: '月', year: '年' },
  'en-US': { label: 'Range', day: 'Day', week: 'Week', month: 'Month', year: 'Year' },
} as const;

function useOptions() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return {
    label: copy.label,
    options: [
      { label: copy.day, value: 'day' },
      { label: copy.week, value: 'week' },
      { label: copy.month, value: 'month' },
      { label: copy.year, value: 'year', disabled: true },
    ],
  };
}

function SegmentedPlayground({ options: _options, ...args }: React.ComponentProps<typeof Segmented>) {
  const { label, options } = useOptions();
  return <Segmented aria-label={label} {...args} options={options} />;
}

const meta = {
  title: 'Components/Segmented',
  component: Segmented,
  args: {
    size: 'md',
    block: false,
    disabled: false,
    defaultValue: 'week',
    options: [],
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <SegmentedPlayground {...args} />,
} satisfies Meta<typeof Segmented>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const { label, options } = useOptions();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Segmented key={size} size={size} aria-label={`${label}-${size}`} options={options} defaultValue="week" />
        ))}
      </div>
    );
  },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const { label, options } = useOptions();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '420px' }}>
        <Segmented aria-label={`${label}-block`} block options={options} defaultValue="day" />
        <Segmented aria-label={`${label}-disabled`} disabled options={options} defaultValue="week" />
      </div>
    );
  },
};
