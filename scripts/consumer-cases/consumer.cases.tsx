// Consumer-audit cases (M28). Written the way a first-time user would write
// them — minimal props, naive shapes. They are copied into a throwaway project
// that depends on the packed tarball, then verified on three layers:
//   1. types  — strict tsc against the package's own d.ts (no repo paths)
//   2. SSR    — renderToString from the packaged dist in a bare Node env
//   3. runtime— createRoot render under jsdom with browser-ish stubs
// Any friction hit while writing/running these IS an audit finding.
import { useState, type ReactElement } from 'react';
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Command,
  DatePicker,
  Drawer,
  Dropdown,
  Empty,
  Form,
  FormItem,
  GlassSurface,
  Input,
  InputNumber,
  LiquidGlassConfig,
  Menu,
  Modal,
  Pagination,
  Popover,
  Progress,
  ProgressiveBlur,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Segmented,
  Select,
  SideNav,
  Skeleton,
  Slider,
  Spin,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Textarea,
  Timeline,
  TimePicker,
  Toaster,
  Tooltip,
  Upload,
  createTheme,
  presetThemes,
  toast,
  useAmbientFromImage,
  useForm,
  type TableColumn,
} from '@ttqtt/liquid-glass-react';

export interface ConsumerCase {
  name: string;
  /** Closed overlays legitimately render nothing. */
  allowEmpty?: boolean;
  render: () => ReactElement;
}

// -- stateful minimal consumers (controlled-mode story) ----------------------

function ControlledInput() {
  const [value, setValue] = useState('');
  return <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="你的名字" />;
}

function AmbientProbe() {
  const ambient = useAmbientFromImage(null);
  return <div style={{ ['--lg-ambient' as string]: ambient ?? 'transparent' }}>ambient</div>;
}

function ExternalForm() {
  const form = useForm<{ email: string }>();
  return (
    <Form form={form} initialValues={{ email: '' }} onSubmit={(v) => void v.email}>
      <FormItem name="email" label="邮箱" required rules={[{ pattern: /@/, message: '格式不对' }]}>
        <Input />
      </FormItem>
      <Button type="submit">提交</Button>
    </Form>
  );
}

interface Row {
  id: string;
  name: string;
  score: number;
}

const ROWS: Row[] = [
  { id: '1', name: '甲', score: 90 },
  { id: '2', name: '乙', score: 80 },
];

const COLUMNS: TableColumn<Row>[] = [
  { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
  { key: 'score', title: '评分', dataIndex: 'score', align: 'right' },
];

// -- the sweep ----------------------------------------------------------------

export const CASES: ConsumerCase[] = [
  { name: 'GlassSurface', render: () => <GlassSurface>玻璃</GlassSurface> },
  {
    name: 'LiquidGlassConfig + theme',
    render: () => (
      <LiquidGlassConfig locale="en-US" theme={presetThemes.warm}>
        <Button>ok</Button>
      </LiquidGlassConfig>
    ),
  },
  {
    name: 'createTheme scoped override',
    render: () => (
      <div style={createTheme({ accent: '#7c3aed', radiusMd: '18px' })}>
        <Button variant="accent">紫色</Button>
      </div>
    ),
  },
  { name: 'ProgressiveBlur', render: () => <ProgressiveBlur size={64} /> },
  { name: 'useAmbientFromImage probe', render: () => <AmbientProbe /> },

  { name: 'Button', render: () => <Button onClick={() => toast.success('好')}>保存</Button> },
  { name: 'Checkbox', render: () => <Checkbox defaultChecked>同意</Checkbox> },
  { name: 'Input (controlled)', render: () => <ControlledInput /> },
  { name: 'Textarea', render: () => <Textarea placeholder="备注" /> },
  {
    name: 'Select',
    render: () => (
      <Select
        options={[
          { value: 'a', label: '苹果' },
          { value: 'b', label: '香蕉' },
        ]}
        defaultValue="a"
      />
    ),
  },
  { name: 'Slider', render: () => <Slider defaultValue={30} aria-label="音量" /> },
  { name: 'Switch', render: () => <Switch defaultChecked aria-label="通知" /> },
  {
    name: 'RadioGroup',
    render: () => (
      <RadioGroup defaultValue="x" aria-label="套餐">
        <Radio value="x">基础</Radio>
        <Radio value="y">高级</Radio>
      </RadioGroup>
    ),
  },
  {
    name: 'Segmented',
    render: () => (
      <Segmented
        aria-label="视图"
        options={[
          { value: 'day', label: '日' },
          { value: 'week', label: '周' },
        ]}
      />
    ),
  },
  { name: 'DatePicker (closed)', render: () => <DatePicker placeholder="选择日期" aria-label="日期" /> },
  { name: 'Dropdown (closed)', render: () => <Dropdown label="更多" items={[{ key: 'a', label: '编辑' }]} /> },
  { name: 'InputNumber', render: () => <InputNumber aria-label="数量" defaultValue={2} min={0} max={9} /> },
  { name: 'Rate', render: () => <Rate aria-label="评分" defaultValue={4} /> },
  { name: 'RangePicker (closed)', render: () => <RangePicker aria-label="日期范围" /> },
  { name: 'TimePicker (closed)', render: () => <TimePicker aria-label="时间" value="09:30" /> },
  { name: 'Timeline', render: () => <Timeline items={[{ key: 'a', content: '创建', time: '09:00' }]} /> },
  { name: 'Upload', render: () => <Upload defaultFileList={[{ key: 'k', name: 'a.txt', status: 'done' }]} /> },

  { name: 'Form + useForm', render: () => <ExternalForm /> },
  {
    name: 'Table (generic inference)',
    render: () => <Table columns={COLUMNS} data={ROWS} rowKey="id" selectable pagination={{ pageSize: 1 }} />,
  },
  { name: 'Pagination', render: () => <Pagination total={42} /> },

  { name: 'Avatar', render: () => <Avatar alt="用户" fallback="U" /> },
  {
    name: 'Badge',
    render: () => (
      <Badge count={5}>
        <span>📮</span>
      </Badge>
    ),
  },
  { name: 'Card', render: () => <Card>卡片内容</Card> },
  { name: 'Progress', render: () => <Progress value={60} aria-label="进度" /> },
  { name: 'Skeleton', render: () => <Skeleton /> },
  { name: 'Spin', render: () => <Spin /> },
  { name: 'Tag', render: () => <Tag color="success">已完成</Tag> },
  { name: 'Empty', render: () => <Empty title="暂无数据" /> },
  {
    name: 'Steps',
    render: () => (
      <Steps
        current={1}
        items={[
          { key: 'a', title: '第一步' },
          { key: 'b', title: '第二步' },
        ]}
      />
    ),
  },
  {
    name: 'Accordion',
    render: () => (
      <Accordion
        defaultValue={['a']}
        items={[
          { key: 'a', title: '标题一', content: '内容一' },
          { key: 'b', title: '标题二', content: '内容二' },
        ]}
      />
    ),
  },
  { name: 'Alert', render: () => <Alert kind="warning" title="注意">请确认。</Alert> },

  {
    name: 'Breadcrumb',
    render: () => <Breadcrumb items={[{ label: '首页', href: '#' }, { label: '详情' }]} />,
  },
  {
    name: 'Tabs',
    render: () => (
      <Tabs
        aria-label="视图"
        items={[
          { key: 'a', label: '概览', content: '内容' },
          { key: 'b', label: '设置', content: '设置项' },
        ]}
      />
    ),
  },
  { name: 'SideNav', render: () => <SideNav aria-label="导航" items={[{ key: 'h', label: '首页' }]} /> },
  {
    name: 'Menu (closed)',
    render: () => (
      <Menu items={[{ key: 'a', label: '重命名' }]}>
        <button type="button">更多</button>
      </Menu>
    ),
  },
  {
    name: 'Drawer (closed)',
    allowEmpty: true,
    render: () => (
      <Drawer open={false} onOpenChange={() => {}}>
        抽屉
      </Drawer>
    ),
  },
  {
    name: 'Command (closed)',
    allowEmpty: true,
    render: () => <Command items={[{ key: 'a', label: '命令' }]} open={false} onOpenChange={() => {}} />,
  },

  {
    name: 'Modal (closed)',
    allowEmpty: true,
    render: () => (
      <Modal open={false} onOpenChange={() => {}}>
        对话框
      </Modal>
    ),
  },
  {
    name: 'Popover (closed trigger)',
    render: () => (
      <Popover content="提示">
        <button type="button">打开</button>
      </Popover>
    ),
  },
  {
    name: 'Tooltip (closed trigger)',
    render: () => (
      <Tooltip content="说明">
        <button type="button">悬停</button>
      </Tooltip>
    ),
  },
  { name: 'Toaster', allowEmpty: true, render: () => <Toaster /> },
];
