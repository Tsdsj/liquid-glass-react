import { render } from '@testing-library/react';
import axe, { type ImpactValue, type Result } from 'axe-core';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Dropdown,
  Empty,
  Form,
  FormItem,
  Input,
  InputNumber,
  Rate,
  Steps,
  Timeline,
  Upload,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Segmented,
  Select,
  SideNav,
  Slider,
  Switch,
  Table,
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
  ['DatePicker', <DatePicker aria-label="生日" placeholder="选择日期" />],
  ['Dropdown', <Dropdown label="更多操作" items={[{ key: 'a', label: '编辑' }]} />],
  ['InputNumber', <InputNumber aria-label="数量" defaultValue={3} min={0} max={10} />],
  ['Rate', <Rate aria-label="评分" defaultValue={3} />],
  ['Timeline', <Timeline items={[{ key: 'a', content: '创建项目', time: '09:00' }]} />],
  ['Upload', <Upload defaultFileList={[{ key: 'k', name: 'a.txt', status: 'done' }]} />],
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
    'Accordion',
    <Accordion
      items={[
        { key: 'a', title: '面板一', content: '内容一' },
        { key: 'b', title: '面板二', content: '内容二' },
      ]}
      defaultValue={['a']}
    />,
  ],
  ['Alert', <Alert kind="warning" title="注意" closable onClose={() => {}}>请确认</Alert>],
  ['Empty', <Empty title="空空如也" description="暂无数据" />],
  [
    'Steps',
    <Steps items={[{ key: 'a', title: '一' }, { key: 'b', title: '二' }]} current={1} />,
  ],
  [
    'Table',
    <Table
      aria-label="用户表"
      rowKey="id"
      columns={[
        { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
        { key: 'age', title: '年龄', dataIndex: 'age' },
      ]}
      data={[
        { id: '1', name: '甲', age: 30 },
        { id: '2', name: '乙', age: 25 },
      ]}
      selectable
    />,
  ],
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
