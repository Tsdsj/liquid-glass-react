// @vitest-environment node
//
// SSR safety net (M17). This file runs in a *Node* environment — `window` and
// `document` are undefined, exactly as on a server render. If any module reached
// for a DOM global at import or render time, importing the library or calling
// renderToString below would throw. Passing proves:
//   1. Every exported component serializes with react-dom/server without crashing.
//   2. The glass engine degrades to its fallback (refraction off) on the server,
//      so the first client frame matches and there is no hydration mismatch.
//   3. Overlays are closed by default and render no portal on the server.
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Drawer,
  Form,
  FormItem,
  GlassSurface,
  Input,
  LiquidGlassConfig,
  Menu,
  Modal,
  Pagination,
  Popover,
  Progress,
  ProgressiveBlur,
  Radio,
  RadioGroup,
  Segmented,
  Select,
  SideNav,
  Skeleton,
  Slider,
  Spin,
  Switch,
  Tabs,
  Tag,
  Textarea,
  Toaster,
  Tooltip,
  useAmbientFromImage,
} from '../index';
import { detectGlassSupport } from '../core/hooks/useGlassSupport';

// Exercises the public advanced-engine hook on the server: it must degrade to
// null (no window/Image) without throwing.
function AmbientProbe() {
  const color = useAmbientFromImage('https://example.test/a.png');
  return <span>{color ?? 'none'}</span>;
}

const CASES: Array<[name: string, element: React.ReactElement]> = [
  ['GlassSurface', <GlassSurface>x</GlassSurface>],
  ['Avatar', <Avatar alt="用户" fallback="U" />],
  [
    'Badge',
    <Badge count={3}>
      <span>消息</span>
    </Badge>,
  ],
  ['Breadcrumb', <Breadcrumb items={[{ label: '首页', href: '#' }, { label: '组件' }]} />],
  ['Button', <Button>保存</Button>],
  ['Card', <Card>卡片</Card>],
  ['Checkbox', <Checkbox>同意</Checkbox>],
  [
    'Drawer (closed)',
    <Drawer open={false} onOpenChange={() => {}}>
      抽屉内容
    </Drawer>,
  ],
  [
    'Form',
    <Form initialValues={{ email: '' }}>
      <FormItem name="email" label="邮箱" required>
        <Input />
      </FormItem>
    </Form>,
  ],
  ['Input', <Input aria-label="邮箱" />],
  [
    'Menu (closed)',
    <Menu items={[{ key: 'a', label: '重命名' }]}>
      <button type="button">更多</button>
    </Menu>,
  ],
  [
    'Modal (closed)',
    <Modal open={false} onOpenChange={() => {}}>
      对话框内容
    </Modal>,
  ],
  ['Pagination', <Pagination total={80} />],
  [
    'Popover (closed)',
    <Popover content="提示内容">
      <button type="button">打开</button>
    </Popover>,
  ],
  ['Progress', <Progress aria-label="进度" value={50} />],
  ['ProgressiveBlur', <ProgressiveBlur size={80} />],
  [
    'RadioGroup',
    <RadioGroup aria-label="套餐" defaultValue="a">
      <Radio value="a">A</Radio>
      <Radio value="b">B</Radio>
    </RadioGroup>,
  ],
  ['Segmented', <Segmented aria-label="模式" options={[{ label: '列表', value: 'l' }]} />],
  ['Select', <Select aria-label="城市" options={[{ label: '北京', value: 'bj' }]} />],
  ['SideNav', <SideNav aria-label="导航" items={[{ key: 'h', label: '首页' }]} />],
  ['Skeleton', <Skeleton />],
  ['Slider', <Slider aria-label="音量" defaultValue={20} />],
  ['Spin', <Spin />],
  ['Switch', <Switch aria-label="通知" />],
  ['Tabs', <Tabs aria-label="视图" items={[{ key: 'a', label: '概览', content: '内容' }]} />],
  ['Tag', <Tag>标签</Tag>],
  ['Textarea', <Textarea aria-label="备注" />],
  ['Toaster', <Toaster />],
  [
    'Tooltip (closed)',
    <Tooltip content="说明">
      <button type="button">悬停</button>
    </Tooltip>,
  ],
  [
    'LiquidGlassConfig',
    <LiquidGlassConfig locale="en-US">
      <Button>ok</Button>
    </LiquidGlassConfig>,
  ],
];

describe('SSR smoke', () => {
  it('runs with no DOM globals present', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  it.each(CASES)('%s renders to a string on the server', (_name, element) => {
    expect(() => renderToString(element)).not.toThrow();
  });

  it('useAmbientFromImage degrades to null on the server', () => {
    expect(renderToString(<AmbientProbe />)).toContain('none');
  });

  it('degrades to the frosted fallback (refraction off) on the server', () => {
    // No window ⇒ no support detection ⇒ fallback material, matching the first
    // client frame so hydration stays consistent.
    expect(detectGlassSupport()).toBe(false);
    expect(renderToString(<Button>保存</Button>)).toContain('data-refraction="off"');
  });

  it('renders no portal for closed overlays on the server', () => {
    expect(
      renderToString(
        <Modal open={false} onOpenChange={() => {}}>
          对话框内容
        </Modal>,
      ),
    ).not.toContain('对话框内容');
    expect(
      renderToString(
        <Drawer open={false} onOpenChange={() => {}}>
          抽屉内容
        </Drawer>,
      ),
    ).not.toContain('抽屉内容');
  });
});
