import { useState } from 'react';
import { SearchField, Text, TextField } from '@ttqtt/liquid-glass-react';
import type { ComponentDoc } from './types.js';

export const fieldDocs: ComponentDoc[] = [
  {
    slug: 'text-field', name: 'TextField', title: '输入框', group: '输入',
    summary: '带标签的文字输入，错误信息和字段绑在一起。',
    when: [
      '任何需要用户打字的地方。每个字段都要有可见的标签。',
      '占位文字只能提示格式，不能当标签用——一开始打字它就消失了。',
      '出错时说清楚发生了什么、怎么改，不要只把框变红。',
    ],
    examples: [
      {
        id: 'field-basic', title: '标签、提示与错误', description: '在第二个框里输入不含 @ 的内容，可以看到错误状态。',
        height: 300,
        render: function FieldBasic() {
          const [email, setEmail] = useState('');
          const invalid = email.length > 0 && !email.includes('@');
          return <div style={{ display: 'grid', gap: 16, width: 300 }}>
            <TextField label="工作区名称" defaultValue="我的灵感空间" autoComplete="off" />
            <TextField label="电子邮件" type="email" inputMode="email" autoComplete="email"
              placeholder="name@example.com" value={email} onChange={event => setEmail(event.target.value)}
              hint="只用于这个演示，不会发送到任何地方。"
              error={invalid ? '电子邮件需要包含 @。' : undefined} />
          </div>;
        },
        code: `<TextField
  label="电子邮件"
  type="email"
  inputMode="email"
  autoComplete="email"
  hint="我们不会公开你的邮箱。"
  error={invalid ? '电子邮件需要包含 @。' : undefined}
/>`,
      },
      {
        id: 'field-adornment', title: '前后附加', description: '单位、货币符号这类固定内容放在框里，不要挤进占位文字。',
        height: 230,
        render: () => <div style={{ display: 'grid', gap: 16, width: 300 }}>
          <TextField label="预算" type="text" inputMode="decimal" defaultValue="1280"
            leading={<Text as="span" variant="subhead" tone="secondary">¥</Text>}
            trailing={<Text as="span" variant="footnote" tone="secondary">元</Text>} />
          <TextField label="隐藏标签的搜索词" labelHidden placeholder="标签只给读屏看" />
        </div>,
        code: `<TextField label="预算" inputMode="decimal"
  leading={<span>¥</span>} trailing={<span>元</span>} />

{/* 标签视觉上隐藏，但读屏和语音控制仍然能用 */}
<TextField label="搜索词" labelHidden placeholder="搜索" />`,
      },
    ],
    props: [
      { name: 'label', type: 'ReactNode', required: true, description: '可见标签，和输入框正式绑定。' },
      { name: 'hint', type: 'ReactNode', description: '下方的补充说明，会随输入框一起被读出来。' },
      { name: 'error', type: 'ReactNode', description: '有值就表示这个字段出错了，同时会告诉读屏。' },
      { name: 'labelHidden', type: 'boolean', default: 'false', description: '视觉上隐藏标签，但保留给读屏和语音控制。' },
      { name: 'leading / trailing', type: 'ReactNode', description: '框内前后的附加内容。' },
    ],
    notes: [
      '字号不小于 16px，否则在 iPhone 上一点击就会把整页放大。',
      '焦点框画在外层容器上，只有用键盘走到时才出现——鼠标点击不会亮。',
      'autocomplete 和 inputmode 由你按字段用途传，这是表单用起来像原生的关键。',
    ],
  },
  {
    slug: 'search-field', name: 'SearchField', title: '搜索框', group: '输入',
    summary: '圆头的搜索输入，自带清除按钮。',
    when: [
      '在大量内容里找东西。宽屏放在右上角，手机上放在底部或随键盘升起。',
      '结果应该边打边出，而不是等用户按回车。',
      '有内容时提供一键清除，不要让人一个个删。',
    ],
    examples: [
      {
        id: 'search-basic', title: '基础用法', description: '输入后右侧出现清除按钮，回车提交。',
        backdrop: 'both', height: 200,
        render: function SearchBasic() {
          const [query, setQuery] = useState('');
          const [submitted, setSubmitted] = useState('');
          return <div style={{ display: 'grid', gap: 12, width: 320 }}>
            <SearchField aria-label="搜索组件" placeholder="搜索组件…" value={query}
              onValueChange={setQuery} onSubmitQuery={setSubmitted} clearLabel="清除搜索" />
            <Text variant="caption1" tone="secondary">
              {submitted ? `已提交：${submitted}` : '输入点什么试试'}
            </Text>
          </div>;
        },
        code: `<SearchField
  aria-label="搜索组件"
  placeholder="搜索组件…"
  value={query}
  onValueChange={setQuery}
  onSubmitQuery={runSearch}
/>`,
      },
    ],
    props: [
      { name: 'value / defaultValue', type: 'string', description: '当前的搜索词。' },
      { name: 'onValueChange', type: '(value: string) => void', description: '每次输入变化。' },
      { name: 'onSubmitQuery', type: '(value: string) => void', description: '按回车时触发。' },
      { name: 'clearLabel', type: 'string', default: "'Clear search'", description: '清除按钮的名字。' },
      { name: 'aria-label', type: 'string', required: true, description: '这个搜索框在搜什么。' },
    ],
    notes: [
      '是一个真正的搜索表单，手机键盘上会出现“搜索”键，系统自带的清除手势也能用。',
      '框里有内容时按一次 Escape 会先清空，再按一次才关闭所在的弹层——这是浏览器的行为。',
    ],
  },
];
