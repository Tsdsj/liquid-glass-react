import { render } from '@testing-library/react';
import axe, { type ImpactValue, type Result } from 'axe-core';
import { describe, expect, it } from 'vitest';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Form,
  FormItem,
  Input,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Segmented,
  Select,
  SideNav,
  Slider,
  Switch,
  Tabs,
  Tag,
} from '../index';

// Automated a11y smoke guard (M17). jsdom has no layout or paint, so rules that
// depend on real rendering can't be judged here and are disabled with a reason:
//   - color-contrast: needs computed pixel colors (no compositor in jsdom).
// Everything else (role / name / aria / label wiring) is judged as-is. We only
// fail on `critical` / `serious` impact — this is a regression net, not a full
// audit. `region`/landmark findings are `moderate` and intentionally not gated.
const DISABLED_RULES = {
  'color-contrast': { enabled: false },
} as const;

const BLOCKING_IMPACTS: ReadonlyArray<ImpactValue> = ['critical', 'serious'];

function formatViolations(violations: Result[]): string {
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`)
    .join('\n');
}

// Each entry renders a representative component in a state a user can reach.
// Overlay components are covered by their triggers / open state elsewhere; here
// we exercise the always-on surface controls plus a couple of closed triggers.
const CASES: Array<[name: string, element: React.ReactElement]> = [
  ['Button', <Button>保存</Button>],
  [
    'Form',
    <Form initialValues={{ email: '' }}>
      <FormItem name="email" label="邮箱" required help="我们不会公开你的邮箱">
        <Input />
      </FormItem>
    </Form>,
  ],
  ['Checkbox', <Checkbox defaultChecked>同意条款</Checkbox>],
  [
    'RadioGroup',
    <RadioGroup aria-label="套餐" defaultValue="pro">
      <Radio value="free">免费</Radio>
      <Radio value="pro">专业</Radio>
    </RadioGroup>,
  ],
  ['Switch', <Switch aria-label="启用通知" defaultChecked />],
  ['Slider', <Slider aria-label="音量" defaultValue={40} />],
  ['Input', <Input aria-label="邮箱" defaultValue="a@b.com" />],
  [
    'Select',
    <Select
      aria-label="城市"
      defaultValue="bj"
      options={[
        { label: '北京', value: 'bj' },
        { label: '上海', value: 'sh' },
      ]}
    />,
  ],
  [
    'Tabs',
    <Tabs
      aria-label="视图"
      items={[
        { key: 'a', label: '概览', content: '概览内容' },
        { key: 'b', label: '明细', content: '明细内容' },
      ]}
    />,
  ],
  [
    'Segmented',
    <Segmented
      aria-label="模式"
      defaultValue="list"
      options={[
        { label: '列表', value: 'list' },
        { label: '网格', value: 'grid' },
      ]}
    />,
  ],
  ['Pagination', <Pagination total={120} defaultCurrent={2} />],
  [
    'Breadcrumb',
    <Breadcrumb
      items={[{ label: '首页', href: '#' }, { label: '组件', href: '#' }, { label: 'Button' }]}
    />,
  ],
  [
    'SideNav',
    <SideNav
      aria-label="主导航"
      defaultValue="home"
      items={[
        { type: 'group', label: '常用' },
        { key: 'home', label: '首页' },
        { key: 'docs', label: '文档' },
      ]}
    />,
  ],
  ['Card', <Card>卡片内容</Card>],
  ['Tag', <Tag>标签</Tag>],
  [
    'Badge',
    <Badge count={5}>
      <span>消息</span>
    </Badge>,
  ],
  ['Progress', <Progress aria-label="上传进度" value={60} />],
  ['Avatar', <Avatar alt="张三" fallback="张" />],
];

describe('a11y smoke', () => {
  it.each(CASES)('%s has no critical or serious axe violations', async (_name, element) => {
    const { container } = render(element);
    const results = await axe.run(container, { rules: DISABLED_RULES });
    const blocking = results.violations.filter(
      (v) => v.impact != null && BLOCKING_IMPACTS.includes(v.impact),
    );
    expect(blocking, `\n${formatViolations(blocking)}`).toHaveLength(0);
  });
});
