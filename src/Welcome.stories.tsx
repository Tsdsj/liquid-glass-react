import type { Meta, StoryObj } from '@storybook/react-vite';

function Welcome() {
  return (
    <main
      style={{
        display: 'grid',
        minHeight: 'calc(100vh - 96px)',
        alignContent: 'center',
        maxWidth: '720px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '48px', lineHeight: 1.05 }}>Liquid Glass React</h1>
      <p style={{ margin: '16px 0 0', maxWidth: '42rem', fontSize: '18px', lineHeight: 1.6 }}>
        Storybook scaffold is ready for the glass engine and component stories.
      </p>
    </main>
  );
}

const meta = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Welcome>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
