import { useState } from 'react';
import { List, ListRow, ListSection, SearchField, Text, TextField } from '@ttqtt/liquid-glass-react';
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
      {
        id: 'field-multiline', title: '多行', description: '真正的 textarea：回车换行、浏览器自带的拉伸把手、拼写检查和语音输入都和别处一样。rows="auto" 会跟着内容长。',
        height: 300,
        render: function FieldMultiline() {
          const [note, setNote] = useState('');
          return <div id="field-multiline-demo" style={{ display: 'grid', gap: 16, width: 340 }}>
            <TextField multiline label="备注" rows={3} placeholder="想说点什么"
              value={note} onChange={event => setNote(event.currentTarget.value)} />
            <TextField multiline rows="auto" label="自动长高" placeholder="多打几行试试" />
          </div>;
        },
        code: `<TextField multiline label="备注" rows={3} value={note} onChange={…} />
<TextField multiline rows="auto" label="自动长高" />`,
      },
      {
        id: 'field-sizes', title: '尺寸', description: '变矮的是控件，不是文字——低于 16px 会让 iOS Safari 在聚焦时把整页放大。',
        height: 320,
        knobs: [
          { name: 'controlSize', label: '高度', type: 'select', value: 'regular', options: [
            { value: 'small', label: '小' }, { value: 'regular', label: '标准' }, { value: 'large', label: '大' },
          ] },
          { name: 'labelHidden', label: '隐藏标签', type: 'boolean', value: false },
          { name: 'hint', label: '显示提示', type: 'boolean', value: false },
          { name: 'multiline', label: '多行', type: 'boolean', value: false },
        ],
        render: function FieldSizes({ knobs }) {
          /* Branched rather than `multiline={…}`: the two forms are a discriminated union, which
             is the point — a `<textarea>` and an `<input>` do not take the same props. */
          const shared = {
            label: '可调节的字段',
            controlSize: knobs.controlSize as 'regular',
            labelHidden: knobs.labelHidden === true,
            hint: knobs.hint === true ? '提示会和输入框一起被读出来。' : undefined,
            placeholder: '在这里打字',
          };
          /* The three fixed sizes first: this demo is also where the height comparison is
             measured, and a fourth field of adjustable height at the top would be the first
             thing measured. */
          return <div id="field-sizes-demo" style={{ display: 'grid', gap: 12, width: 340 }}>
            <TextField controlSize="small" label="小" placeholder="36px" />
            <TextField label="标准" placeholder="44px" />
            <TextField controlSize="large" label="大" placeholder="52px" />
            {knobs.multiline === true ? <TextField multiline rows={3} {...shared} /> : <TextField {...shared} />}
          </div>;
        },
        code: knobs => `<TextField${knobs.multiline ? '\n  multiline' : ''}
  label="可调节的字段"${knobs.controlSize === 'regular' ? '' : `\n  controlSize="${knobs.controlSize}"`}${knobs.labelHidden ? '\n  labelHidden' : ''}${knobs.hint ? '\n  hint="提示会和输入框一起被读出来。"' : ''}
/>`,
      },
    ],
    props: [
      { name: 'label', type: 'ReactNode', required: true, description: '可见标签，和输入框正式绑定。' },
      { name: 'hint', type: 'ReactNode', description: '下方的补充说明，会随输入框一起被读出来。' },
      { name: 'error', type: 'ReactNode', description: '有值就表示这个字段出错了，同时会告诉读屏。' },
      { name: 'multiline', type: 'boolean', default: 'false', description: '渲染成 textarea。ref 随之指向 textarea——这是一个可辨识联合，不传时单行那一套完全不变。' },
      { name: 'rows', type: "number | 'auto'", default: '4', description: 'multiline 专用。auto 跟着内容长。' },
      { name: 'controlSize', type: "'small' | 'regular' | 'large'", default: "'regular'", description: '控件高度。文字大小不变。' },
      { name: 'labelHidden', type: 'boolean', default: 'false', description: '视觉上隐藏标签，但保留给读屏和语音控制。' },
      { name: 'leading / trailing', type: 'ReactNode', description: '框内前后的附加内容。' },
    ],
    notes: [
      '字号不小于 16px，否则在 iPhone 上一点击就会把整页放大。',
      '焦点框画在外层容器上，只有用键盘走到时才出现——鼠标点击不会亮。',
      'autocomplete 和 inputmode 由你按字段用途传，这是表单用起来像原生的关键。',
    ],
    related: ['search-field', 'list'],
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
        backdrop: 'both', height: 220,
        knobs: [
          { name: 'placeholder', label: '占位文字', type: 'text', value: '搜索组件…' },
          { name: 'disabled', label: '不可用', type: 'boolean', value: false },
        ],
        render: function SearchBasic({ knobs }) {
          const [query, setQuery] = useState('');
          const [submitted, setSubmitted] = useState('');
          return <div style={{ display: 'grid', gap: 12, width: 320 }}>
            <SearchField aria-label="搜索组件" placeholder={String(knobs.placeholder)} value={query}
              disabled={knobs.disabled === true}
              onValueChange={setQuery} onSubmitQuery={setSubmitted} />
            <Text variant="caption1" tone="secondary" role="status">
              {submitted ? `已提交：${submitted}` : '输入点什么试试'}
            </Text>
          </div>;
        },
        code: knobs => `<SearchField
  aria-label="搜索组件"
  placeholder="${knobs.placeholder}"${knobs.disabled ? '\n  disabled' : ''}
  value={query}
  onValueChange={setQuery}
  onSubmitQuery={runSearch}
/>`,
      },
      {
        id: 'search-suggestions', title: '搜索建议', description: '传了 suggestions 之后它就是一个 combobox：上下键在列表里走，回车选中，Escape 只关列表不清空输入框。**筛选永远是你的**——只有应用知道自己的数据里「匹配」是什么意思。',
        height: 300,
        render: function SearchSuggestions() {
          const all = ['按钮 GlassButton', '徽标 GlassBadge', '开关 GlassSwitch', '滑块 GlassSlider', '搜索框 SearchField'];
          const [query, setQuery] = useState('');
          const [picked, setPicked] = useState('还没选');
          const matches = query.trim() === '' ? [] : all.filter(item => item.toLowerCase().includes(query.toLowerCase()));
          return <div id="search-suggestions-demo" style={{ display: 'grid', gap: 12, width: 320 }}>
            <SearchField aria-label="搜索组件" placeholder="输入 g 试试" value={query} onValueChange={setQuery}
              suggestions={matches.map(item => ({ value: item }))}
              onSuggestionSelect={suggestion => setPicked(suggestion.value)} />
            <Text variant="caption1" tone="secondary" role="status">选了：{picked}</Text>
          </div>;
        },
        code: `const matches = all.filter(item => item.includes(query));

<SearchField
  aria-label="搜索组件"
  value={query}
  onValueChange={setQuery}
  suggestions={matches.map(value => ({ value }))}
  onSuggestionSelect={s => go(s.value)}
/>`,
      },
      {
        id: 'search-live', title: '边打边出结果',
        description: '不要等回车。搜索框下面的内容应该随着输入一起变——没有匹配时也要说清楚，而不是留一片空白。',
        height: 320,
        render: function SearchLive() {
          const all = ['封面.png', '背景.jpg', '图标集.sketch', '插画草稿.psd', '头像.png'];
          const [query, setQuery] = useState('');
          const matches = all.filter(name => name.toLowerCase().includes(query.trim().toLowerCase()));
          return <div id="search-live-demo" style={{ display: 'grid', gap: 12, width: 320 }}>
            <SearchField aria-label="搜索文件" placeholder="文件名" value={query} onValueChange={setQuery} />
            {matches.length > 0
              ? <List>
                <ListSection headingLevel={4} header={`${matches.length} 个文件`}>
                  {matches.map(name => <ListRow key={name} label={name} />)}
                </ListSection>
              </List>
              : <Text variant="subhead" tone="secondary" role="status">
                没有匹配「{query}」的文件。试试「png」。
              </Text>}
          </div>;
        },
        code: `const matches = files.filter(file => file.name.includes(query));

<SearchField aria-label="搜索文件" value={query} onValueChange={setQuery} />
{matches.length > 0
  ? <List>…</List>
  : <Text tone="secondary">没有匹配「{query}」的文件。</Text>}`,
      },
    ],
    props: [
      { name: 'value / defaultValue', type: 'string', description: '当前的搜索词。' },
      { name: 'onValueChange', type: '(value: string) => void', description: '每次输入变化。' },
      { name: 'onSubmitQuery', type: '(value: string) => void', description: '按回车时触发。' },
      { name: 'clearLabel', type: 'string', description: '清除按钮的名字。不传就用 GlassProvider 的 strings 表，再没有就是英文 “Clear search”。' },
      { name: 'suggestions', type: 'SearchSuggestion[]', description: '建议列表（{ value, label?, icon? }）。传了就变成 combobox。筛选是调用方的事。' },
      { name: 'onSuggestionSelect', type: '(suggestion) => void', description: '选中了某条建议。' },
      { name: 'aria-label', type: 'string', required: true, description: '这个搜索框在搜什么。' },
    ],
    notes: [
      '是一个真正的搜索表单，手机键盘上会出现“搜索”键，系统自带的清除手势也能用。',
      '框里有内容时按一次 Escape 会先清空，再按一次才关闭所在的弹层——这是浏览器的行为。',
    ],
    related: ['text-field', 'tab-bar'],
  },
];
