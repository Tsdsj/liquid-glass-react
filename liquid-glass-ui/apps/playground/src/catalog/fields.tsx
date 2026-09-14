import { useState } from 'react';
import { SearchField, Text, TextField } from '@liquid-glass-ui/react';
import type { ComponentDoc } from './types.js';

export const fieldDocs: ComponentDoc[] = [
  {
    slug: 'text-field', name: 'TextField', group: '输入',
    summary: '带真实 label 的圆角输入框，错误信息与字段关联。',
    rule: 'placeholder 是格式提示，不是标签的替代品。错误要说清发生了什么以及怎么修，不能只靠一个红框——只有颜色承载含义就过不了对比度这一关。',
    demoHeight: 300,
    example: function TextFieldExample() {
      const [email, setEmail] = useState('');
      const invalid = email.length > 0 && !email.includes('@');
      return <div style={{ display: 'grid', gap: 16, width: 300 }}>
        <TextField label="工作区名称" defaultValue="我的灵感空间" autoComplete="off" />
        <TextField label="电子邮件" type="email" inputMode="email" autoComplete="email"
          placeholder="name@example.com" value={email} onChange={event => setEmail(event.target.value)}
          hint="只用于本次演示，不会发送到任何服务。"
          error={invalid ? '电子邮件需要包含 @。' : undefined} />
        <Text variant="caption1" tone="secondary">输入不含 @ 的内容会触发错误状态</Text>
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
    props: [
      { name: 'label', type: 'ReactNode', required: true, description: '可见标签，通过 <label for> 关联。' },
      { name: 'hint', type: 'ReactNode', description: '辅助说明，随输入框一起朗读。' },
      { name: 'error', type: 'ReactNode', description: '存在即标记 aria-invalid 并接上 aria-describedby。' },
      { name: 'labelHidden', type: 'boolean', default: 'false', description: '视觉隐藏但保留给辅助技术与语音控制。' },
      { name: 'leading / trailing', type: 'ReactNode', description: '前后附加元素。' },
    ],
    a11y: [
      '字号不低于 16px，否则 iOS Safari 聚焦时会缩放整页。',
      '焦点环画在容器上（:focus-within 的 outline），而不是 box-shadow —— box-shadow 是玻璃自己的。',
      'autocomplete 与 inputmode 由调用方按字段用途传入，这是表单“像原生”的大部分来源。',
    ],
  },
  {
    slug: 'search-field', name: 'SearchField', group: '输入',
    summary: '独立玻璃表面上的胶囊搜索框，带清除按钮。',
    rule: '搜索在 iPad 与 Mac 上位于工具栏右上；在 iPhone 上是尾部独立的搜索标签，或随键盘升起的输入框。',
    backdrop: 'both', demoHeight: 200,
    example: function SearchExample() {
      const [query, setQuery] = useState('');
      const [submitted, setSubmitted] = useState('');
      return <div style={{ display: 'grid', gap: 12, width: 320 }}>
        <SearchField aria-label="搜索组件" placeholder="搜索组件…" value={query}
          onValueChange={setQuery} onSubmitQuery={setSubmitted} clearLabel="清除搜索" />
        <Text variant="caption1" tone="secondary">
          {submitted ? `已提交：${submitted}` : '输入后回车提交，右侧出现清除按钮'}
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
    props: [
      { name: 'value / defaultValue', type: 'string', description: '受控或非受控查询串。' },
      { name: 'onValueChange', type: '(value: string) => void', description: '每次输入变化。' },
      { name: 'onSubmitQuery', type: '(value: string) => void', description: '回车提交。' },
      { name: 'clearLabel', type: 'string', default: "'Clear search'", description: '清除按钮的可访问名称。' },
      { name: 'aria-label', type: 'string', required: true, description: '输入框的可访问名称。' },
    ],
    a11y: [
      '外层是 role="search" 的 form，输入框为 type="search"，移动端键盘与平台自带清除手势因此正确。',
      '焦点环落在玻璃容器上，输入框自身的 outline 被替代而不是被删掉。',
    ],
  },
];
