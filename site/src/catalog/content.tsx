import { useState } from 'react';
import {
  Card, Concentric, DisclosureGroup, Divider, Form, FormRow, FormSection, GlassButton, GroupBox,
  GlassStepper, GlassSwitch, Grid, Kbd, LibraryIcon, TextField, List, ListRow, ListSection, MaterialView,
  OutlineView, type OutlineNode, Text, useShortcut,
} from '@ttqtt/liquid-glass-react';
import { Icon } from '../icons.js';
import { demoLink } from '../site/demo.js';
import type { ComponentDoc } from './types.js';

export const contentDocs: ComponentDoc[] = [
  {
    slug: 'text', name: 'Text', title: '文本', group: '内容',
    summary: '一整套排版样式，字号、行高、字距一起定好，并跟随系统的文字大小设置缩放。',
    when: [
      '页面上任何一段文字都可以用它，标题、正文、说明、脚注都在同一套比例里。',
      '想区分主次时换 tone，不要靠改小字号——最小的一档已经是可读的下限。',
      '需要对齐的数字（价格、时长、计数）加上 tabular，列才不会抖。',
    ],
    examples: [
      {
        id: 'text-scale', title: '文本样式', description: '从大标题到脚注共十一档。右上角把文字大小调大，可以看到整套一起放大。',
        height: 330,
        render: () => <div style={{ display: 'grid', gap: 10, textAlign: 'start' }}>
          <Text as="h4" variant="largeTitle" emphasized>大标题</Text>
          <Text variant="title2" emphasized>二级标题</Text>
          <Text variant="headline">小标题会自动加粗</Text>
          <Text variant="body">正文。大段阅读用这一档。</Text>
          <Text variant="subhead" tone="secondary">次级说明</Text>
          <Text variant="footnote" tone="secondary">脚注</Text>
          <Text variant="caption2" tone="secondary">最小的一档，11px</Text>
        </div>,
        code: `<Text as="h1" variant="largeTitle" emphasized>大标题</Text>
<Text variant="body">正文</Text>
<Text variant="footnote" tone="secondary">脚注</Text>`,
      },
      {
        id: 'text-tone', title: '强调与色调', description: '同一档字号下，用字重和颜色区分主次。tertiary 是占位符和停用态的颜色，对比度本来就低，不要拿它写正文。',
        height: 230,
        knobs: [
          { name: 'variant', label: '样式', type: 'select', value: 'body', options: [
            { value: 'largeTitle', label: '大标题' }, { value: 'headline', label: '小标题' },
            { value: 'body', label: '正文' }, { value: 'footnote', label: '脚注' },
          ] },
          { name: 'tone', label: '色调', type: 'select', value: 'primary', options: [
            { value: 'primary', label: '主要' }, { value: 'secondary', label: '次要' },
            { value: 'accent', label: '强调' }, { value: 'destructive', label: '危险' },
          ] },
          { name: 'emphasized', label: '加粗', type: 'boolean', value: false },
        ],
        render: function TextTone({ knobs }) {
          return <div style={{ display: 'grid', gap: 8, textAlign: 'start' }}>
            <Text variant={knobs.variant as 'body'} tone={knobs.tone as 'primary'} emphasized={knobs.emphasized === true}>
              调上面的旋钮看这一行
            </Text>
            <Text variant="body" tone="secondary">次要</Text>
            {/* tertiary 不是"更次要的正文"，是占位符和停用态的颜色——它在设计上就不到 4.5:1。
                这一行照它的用途写，因为这一页是教人排版的那一页。 */}
            <Text variant="body" tone="tertiary">占位符 / 已停用</Text>
            <Text variant="body" tone="destructive">危险操作</Text>
          </div>;
        },
        code: knobs => `<Text variant="${knobs.variant}"${knobs.tone === 'primary' ? '' : ` tone="${knobs.tone}"`}${knobs.emphasized ? ' emphasized' : ''}>
  一行文字
</Text>`,
      },
      {
        id: 'text-tabular', title: '数字对齐', description: '等宽数字让上下两行的位数对齐，适合金额、时间和计数。',
        height: 170,
        render: () => <div style={{ display: 'grid', gap: 6, textAlign: 'end', minWidth: 160 }}>
          <Text variant="body" tabular>1,204.00</Text>
          <Text variant="body" tabular>98.50</Text>
          <Text variant="body" tabular>7,760.25</Text>
          <Text variant="caption1" tone="secondary">加上 tabular 后每一位都等宽</Text>
        </div>,
        code: `<Text variant="body" tabular>1,204.00</Text>`,
      },
    ],
    props: [
      { name: 'variant', type: 'TextStyle', default: "'body'", description: '文本样式。它同时决定字号、行高和字距，不要只改其中一项。' },
      { name: 'emphasized', type: 'boolean', default: 'false', description: '加粗版本。' },
      { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'accent' | 'destructive'", default: "'primary'", description: '文字颜色，跟随浅色与深色自动切换。' },
      { name: 'as', type: 'ElementType', default: "'p'", description: '渲染成什么元素。标题要显式写 as="h2"，组件不会替你猜层级。' },
      { name: 'tabular', type: 'boolean', default: 'false', description: '等宽数字。' },
    ],
    notes: [
      '标题层级需要你自己指定。组件不猜，是为了避免一个页面里出现好几个 h1，让读屏用户无法靠标题跳转。',
      '所有字号跟随右上角的文字大小设置；调到最大时布局要能重新排开，不能截断。',
      '中文、日文、韩文下会自动关掉为拉丁字母设计的紧缩字距。',
    ],
    related: ['card', 'list'],
  },
  {
    slug: 'card', name: 'Card', title: '卡片', group: '内容',
    summary: '承载内容的容器，实色背景，不是玻璃。',
    when: [
      '给一组相关内容一个边界：设置分组、信息卡、列表外框。',
      '卡片里再嵌一个圆角元素时用 Concentric，它会自动算出和外框同心的圆角。',
      '不要用玻璃做卡片。满屏半透明会让页面失去层次，也让真正浮起来的工具栏不再显眼。',
    ],
    examples: [
      {
        id: 'card-basic', title: '基础卡片', description: '三种底色层级，配合是否需要投影。',
        height: 260,
        knobs: [
          { name: 'fill', label: '底色', type: 'select', value: 'grouped', options: [
            { value: 'grouped', label: '分组' }, { value: 'plain', label: '纯色' }, { value: 'secondary', label: '次级' },
          ] },
          { name: 'radius', label: '圆角', type: 'number', value: 20, min: 0, max: 34, step: 2 },
          { name: 'padding', label: '内边距', type: 'number', value: 16, min: 0, max: 32, step: 4 },
          { name: 'raised', label: '投影', type: 'boolean', value: false },
        ],
        render: function CardBasic({ knobs }) {
          return <div style={{ display: 'grid', gap: 12, width: 280 }}>
            <Card fill={knobs.fill as 'grouped'} radius={Number(knobs.radius)} padding={Number(knobs.padding)}
              raised={knobs.raised === true}>
              <Text variant="subhead">调上面的旋钮看这张卡片</Text>
            </Card>
            <Card radius={20} padding={16} fill="secondary"><Text variant="subhead">次级背景</Text></Card>
          </div>;
        },
        code: knobs => `<Card${knobs.fill === 'grouped' ? '' : ` fill="${knobs.fill}"`} radius={${knobs.radius}} padding={${knobs.padding}}${knobs.raised ? ' raised' : ''}>
  内容
</Card>`,
      },
      {
        id: 'card-concentric', title: '同心圆角', description: '内圆角 = 外圆角 − 内边距。左边是算对的，右边固定成 4px，角看起来就“喇叭口”了。',
        height: 260,
        render: () => <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Card radius={26} padding={12} style={{ width: 150 }}>
            <Concentric minimum={8} style={{ height: 88, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }}>
              <Text variant="caption1" tone="secondary">26 − 12 = 14</Text>
            </Concentric>
            <Text variant="caption1" tone="secondary" style={{ marginBlockStart: 8 }}>算对了</Text>
          </Card>
          <Card radius={26} padding={12} style={{ width: 150 }}>
            <div style={{ height: 88, borderRadius: 4, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }}>
              <Text variant="caption1" tone="secondary">固定 4px</Text>
            </div>
            <Text variant="caption1" tone="destructive" style={{ marginBlockStart: 8 }}>喇叭口</Text>
          </Card>
        </div>,
        code: `<Card radius={26} padding={12}>
  <Concentric minimum={8}>
    <img src="…" alt="" />
  </Concentric>
</Card>`,
      },
      {
        id: 'card-interactive', title: '整张卡片可点',
        description: '卡片没有语义角色，所以「可点」必须由里面真正的链接或按钮承担。给卡片绑一个 onClick 做出来的东西，键盘走不进去、读屏也不会说它是什么。',
        height: 250,
        render: () => <div id="card-interactive-demo" style={{ display: 'grid', gap: 12, width: 300 }}>
          <Card radius={20} padding={0} raised>
            {/* The whole card is the link's box; the card stays a container. */}
            <a className="card-link" {...demoLink} style={{ display: 'grid', gap: 4, padding: 16 }}>
              <Text as="span" variant="headline">阿尔卑斯的早晨</Text>
              <Text as="span" variant="footnote" tone="secondary">12 张照片 · 上周</Text>
            </a>
          </Card>
          <Text variant="caption1" tone="secondary">用 Tab 走一遍：焦点会落在卡片上，因为焦点在那个链接上。</Text>
        </div>,
        code: `<Card radius={20} padding={0}>
  <a href="/albums/alps" style={{ display: 'block', padding: 16 }}>
    <Text as="span" variant="headline">阿尔卑斯的早晨</Text>
  </a>
</Card>`,
      },
    ],
    props: [
      { name: 'radius', type: 'number', default: '26', description: '圆角。同心的子元素会以它为基准。' },
      { name: 'padding', type: 'number', default: '16', description: '内边距。同心的子元素会减掉这个值。' },
      { name: 'fill', type: "'grouped' | 'plain' | 'secondary'", default: "'grouped'", description: '底色层级。' },
      { name: 'raised', type: 'boolean', default: 'false', description: '一层很轻的投影。内容层的投影要克制。' },
      { name: 'minimum', type: 'number', default: '0', description: 'Concentric 专用：这个元素单独出现时的兜底圆角。' },
    ],
    notes: ['卡片只是容器，本身没有语义角色，语义由里面的元素承担。'],
    related: ['material-view', 'list', 'text'],
    imports: ['Card', 'Concentric'],
  },
  {
    slug: 'list', name: 'List', title: '列表', group: '内容',
    summary: '设置页那种列表：分组内嵌、行高舒展、分区标题在上方。',
    when: [
      '展示设置项、资料字段、或一组可以点进去的条目。',
      '行尾可以放开关、步进器这类控件，也可以只放一个当前值。',
      '条目很多且结构一致时，可以换成通栏样式，减少视觉切割。',
    ],
    examples: [
      {
        id: 'list-basic', title: '设置列表', description: '分区标题用正常大小写，不用全大写。行尾的箭头表示点进去还有下一层。',
        height: 290,
        knobs: [
          { name: 'variant', label: '样式', type: 'select', value: 'insetGrouped', options: [
            { value: 'insetGrouped', label: '分组内嵌' }, { value: 'plain', label: '通栏' },
          ] },
          { name: 'footer', label: '显示分区说明', type: 'boolean', value: true },
          { name: 'disclosure', label: '显示箭头', type: 'boolean', value: true },
        ],
        render: function ListBasic({ knobs }) {
          return <List style={{ width: 320 }} variant={knobs.variant as 'plain'}>
            <ListSection headingLevel={4} header="显示与亮度" footer={knobs.footer === true ? '这些设置只影响这个演示。' : undefined}>
              <ListRow label="外观" value="浅色" onSelect={() => {}} disclosure={knobs.disclosure === true} />
              <ListRow label="文字大小" secondaryLabel="影响整站排版" value="标准" onSelect={() => {}}
                disclosure={knobs.disclosure === true} />
            </ListSection>
          </List>;
        },
        code: knobs => `<List${knobs.variant === 'insetGrouped' ? '' : ` variant="${knobs.variant}"`}>
  <ListSection header="显示与亮度"${knobs.footer ? ' footer="说明文字"' : ''}>
    <ListRow label="外观" value="浅色" onSelect={open}${knobs.disclosure ? '' : ' disclosure={false}'} />
  </ListSection>
</List>`,
      },
      {
        id: 'list-accessory', title: '带图标和控件', description: '行尾放了控件就不再显示箭头——这一行是就地操作，不是跳转。',
        height: 230,
        render: function ListAccessory() {
          const [wifi, setWifi] = useState(true);
          const [roam, setRoam] = useState(false);
          return <List style={{ width: 320 }}>
            <ListSection headingLevel={4} header="网络">
              <ListRow label="Wi‑Fi" leading={<LibraryIcon name="search" size={20} />}
                accessory={<GlassSwitch aria-label="Wi‑Fi" checked={wifi} onCheckedChange={setWifi} />} />
              <ListRow label="数据漫游" leading={<LibraryIcon name="plus" size={20} />}
                accessory={<GlassSwitch aria-label="数据漫游" checked={roam} onCheckedChange={setRoam} />} />
            </ListSection>
          </List>;
        },
        code: `<ListRow
  label="Wi‑Fi"
  leading={<WifiIcon />}
  accessory={<GlassSwitch aria-label="Wi‑Fi" checked={on} onCheckedChange={setOn} />}
/>`,
      },
      {
        id: 'list-destructive', title: '危险操作与不可用', description: '危险操作标红，并且要配确认或撤销。不可用的行保留在原位，不要直接消失。不可用的跳转行不再是链接，键盘和鼠标都走不进去。',
        height: 258,
        render: () => <List style={{ width: 320 }} id="list-disabled-demo">
          <ListSection>
            <ListRow label="导出数据" onSelect={() => {}} />
            <ListRow label="暂不可用" secondaryLabel="需要先连接网络" disabled onSelect={() => {}} />
            <ListRow label="订阅设置" secondaryLabel="登录后可用" href="#/components/card" disabled />
            <ListRow label="删除账户" destructive onSelect={() => {}} disclosure={false} />
          </ListSection>
        </List>,
        code: `<ListRow label="删除账户" destructive onSelect={confirmDelete} disclosure={false} />
<ListRow label="暂不可用" secondaryLabel="需要先连接网络" disabled />
<ListRow label="订阅设置" href="/billing" disabled />`,
      },
    ],
    props: [
      { name: 'variant', type: "'insetGrouped' | 'plain'", default: "'insetGrouped'", description: 'List：分组内嵌，或通栏铺满。' },
      { name: 'header / footer', type: 'ReactNode', description: 'ListSection：分区标题与下方说明。' },
      { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '3', description: 'ListSection：分区标题的标题层级。它确实是个标题——读屏用户靠它找到这一组——所以不是取消，而是放到对的深度。' },
      { name: 'label', type: 'ReactNode', required: true, description: 'ListRow：这一行的主文字。' },
      { name: 'secondaryLabel', type: 'ReactNode', description: '第二行补充说明。' },
      { name: 'value', type: 'ReactNode', description: '行尾的只读值。' },
      { name: 'leading', type: 'ReactNode', description: '行首图标。分隔线会自动让开它。' },
      { name: 'accessory', type: 'ReactNode', description: '行尾的控件。出现时自动隐藏箭头。' },
      { name: 'href / onSelect', type: 'string | (event) => void', description: '任一存在，这一行就是可点的。' },
      { name: 'destructive', type: 'boolean', default: 'false', description: '标红。危险操作还需要确认或撤销。' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '不可用。带 href 的行会改成不可点的按钮，而不是保留链接只加一个 aria-disabled——那样回车和点击还是会跳走。' },
    ],
    notes: [
      '可点的行是真正的链接或按钮，键盘能走到、读屏会报出类型，而不是一个绑了点击事件的方块。',
      '分隔线从文字开始处内缩，不会从图标下面穿过去。',
      '箭头在从右到左的语言里会自动镜像。',
    ],
    related: ['card', 'switch', 'divider'],
    imports: ['List', 'ListSection', 'ListRow'],
  },
  {
    slug: 'kbd', name: 'Kbd', title: '快捷键', group: '内容',
    summary: '一个快捷键提示，按平台的写法排列。',
    when: [
      '菜单项、按钮提示、帮助文字里提到某个快捷键的时候。',
      '修饰键顺序是固定的：⌃ ⌥ ⇧ ⌘，Command 永远挨着被它修饰的那个键。组件会替你排好。',
      '不要用它当按钮。它是一段关于命令的文字，不是命令本身。',
    ],
    examples: [
      {
        id: 'kbd-basic', title: '基础用法', description: '写法随意：符号、单词、加号或空格分隔都行。左边那个自己改改看。',
        height: 210,
        knobs: [{ name: 'keys', label: '快捷键', type: 'text', value: '⌘K' }],
        render: function KbdBasic({ knobs }) {
          return <div id="kbd-basic-demo" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Kbd keys={String(knobs.keys)} />
            <Kbd keys="Cmd+Shift+P" />
            <Kbd keys="ctrl alt delete" />
            <Kbd keys="esc" />
            <Kbd keys="up" />
          </div>;
        },
        code: knobs => `<Kbd keys="${knobs.keys}" />
<Kbd keys="Cmd+Shift+P" />
<Kbd keys="ctrl alt delete" />`,
      },
      {
        id: 'kbd-order', title: '顺序会被纠正', description: '不管传进来的顺序是什么，渲染出来都是 ⌃ ⌥ ⇧ ⌘ 加键名。',
        height: 190,
        render: () => <div id="kbd-order-demo" style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Text variant="caption1" tone="secondary">传 "K+cmd+shift"：</Text><Kbd keys="K+cmd+shift" />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Text variant="caption1" tone="secondary">传 "shift ctrl opt cmd S"：</Text><Kbd keys="shift ctrl opt cmd S" />
          </div>
        </div>,
        code: `{/* 两种写法渲染结果相同 */}
<Kbd keys="K+cmd+shift" />
<Kbd keys="⇧⌘K" />`,
      },
      {
        id: 'kbd-inline', title: '放在句子里', description: '它是行内元素，和正文基线对齐。',
        height: 190,
        render: () => <Text variant="body" style={{ maxWidth: 380 }}>
          按 <Kbd keys="⌘K" /> 打开搜索，<Kbd keys="esc" /> 关闭。菜单里的快捷键提示也用它。
        </Text>,
        code: `<Text variant="body">按 <Kbd keys="⌘K" /> 打开搜索。</Text>`,
      },
      {
        id: 'kbd-bind', title: '把它接上',
        description: '`useShortcut` 和 `Kbd` 读的是同一张表、用同一套规则解析 `mod`，所以印在屏幕上的和真正监听的不会是两回事。下面这个是活的：按一下试试。',
        height: 240,
        render: function KbdBind() {
          const [count, setCount] = useState(0);
          const [bare, setBare] = useState(0);
          useShortcut('mod j', () => setCount(n => n + 1));
          /* 不带修饰键的那一个，就是为了让「在输入框里打字时它不响」可以被看见。 */
          useShortcut('/', () => setBare(n => n + 1));
          return <div id="kbd-bind-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Kbd keys="mod j" /><Text as="span" variant="title2" id="kbd-bind-count">{count}</Text>
              </span>
              <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Kbd keys="/" /><Text as="span" variant="title2" id="kbd-bind-bare">{bare}</Text>
              </span>
            </div>
            <TextField label="随便打点什么" placeholder="在这里打 / 和 j" style={{ width: 260 }} />
            <Text variant="caption1" tone="secondary">
              在上面的输入框里打字：<Kbd keys="/" /> 只是一个斜杠，而 <Kbd keys="mod j" /> 仍然是命令。
            </Text>
          </div>;
        },
        code: `useShortcut('mod j', () => setCount(n => n + 1));
useShortcut('/', () => setBare(n => n + 1));   // 不带修饰键，打字时不响

// 屏幕上印的是同一个来源
<Kbd keys="mod j" />`,
      },
    ],
    props: [
      { name: 'keys', type: 'string', required: true, description: '快捷键。符号、单词、加号或空格分隔都认；认不出来的原样输出。`mod` 会按平台解析成 ⌘ 或 Ctrl。' },
      { name: 'aria-label', type: 'string', description: '读屏听到的内容。默认是拼成单词的版本，比如「Command K」。' },
      { name: 'useShortcut(keys, handler, options?)', type: 'Hook', description: '把同一个写法绑成真的快捷键。options：`enabled`、`scope`（限定在某个元素内）、`passive`（不拦截浏览器默认行为）。' },
    ],
    notes: [
      '⌘ ⌥ ⇧ 这些符号读屏念不出来——有的直接跳过，有的念成「兴趣点符号」。所以元素自己带 aria-label，符号本身标了 aria-hidden。',
      '修饰键顺序由组件决定，不由传入顺序决定。',
      '`mod` 在苹果设备上是 ⌘，在别的机器上是 Ctrl——而且显示和绑定用的是同一次解析。屏幕上写着 ⌘K、实际监听 Ctrl+K，是一句印在界面上的假话。',
      '有模态对话框打开时，外层的快捷键全部失效，只有限定在对话框内的还响。否则 ⌘S 会去保存那张正在问你要不要保存的表单背后的文档。',
      '不带修饰键的快捷键在输入框里打字时不触发——那是字母。带修饰键的照常触发，因为输入框里的 ⌘F 仍然是查找。',
      '开发模式下，两个同时存在的命令绑到同一组键会告警：先挂载的那个会赢，而那不是任何人做过的决定。',
    ],
    related: ['text', 'menu'],
  },
  {
    slug: 'disclosure', name: 'DisclosureGroup', title: '折叠区', group: '内容',
    summary: '一行可以展开的内容。用的是原生 details。',
    when: [
      '把不常用的东西收起来：高级选项、详细说明、不影响主流程的设置。',
      '标签要说清楚**藏的是什么**：「高级选项」，不是「更多」。标签是唯一的判断依据。',
      '最常用的那一项放在折叠区**外面**、展开着。放进去，等于让所有人都多点一次。',
      '不要用它做导航。点进去会换页的是列表行，不是折叠区。',
    ],
    examples: [
      {
        id: 'disclosure-basic', title: '基础用法', description: '标签说明里面是什么；箭头跟着转。浏览器的页内查找命中折叠内容时会自动展开它。',
        height: 270,
        knobs: [
          { name: 'label', label: '标签', type: 'text', value: '高级选项' },
          { name: 'secondaryLabel', label: '第二行', type: 'text', value: '代理、缓存与实验性功能' },
        ],
        render: function DisclosureBasic({ knobs }) {
          return <div id="disclosure-basic-demo" style={{ display: 'grid', gap: 10, width: 360 }}>
            <DisclosureGroup label={String(knobs.label)} secondaryLabel={String(knobs.secondaryLabel) || undefined}>
              <Text variant="subhead" tone="secondary">这里放平时不需要动的设置。</Text>
            </DisclosureGroup>
            <DisclosureGroup label="为什么需要这个权限" defaultOpen>
              <Text variant="subhead" tone="secondary">默认展开——最需要被读到的那一段不该藏起来。</Text>
            </DisclosureGroup>
          </div>;
        },
        code: knobs => `<DisclosureGroup label="${knobs.label}"${knobs.secondaryLabel ? ` secondaryLabel="${knobs.secondaryLabel}"` : ''}>
  <Text variant="subhead">这里放平时不需要动的设置。</Text>
</DisclosureGroup>`,
      },
      {
        id: 'disclosure-controlled', title: '自己控制开合', description: '传 open 就由你说了算；同一时刻只留一个展开，就是手风琴。',
        height: 270,
        render: function DisclosureControlled() {
          const [open, setOpen] = useState<string | null>('a');
          const item = (key: string, label: string, body: string) => <DisclosureGroup key={key}
            label={label} open={open === key} onOpenChange={next => setOpen(next ? key : null)}>
            <Text variant="subhead" tone="secondary">{body}</Text>
          </DisclosureGroup>;
          return <div style={{ display: 'grid', gap: 10, width: 360 }}>
            {item('a', '第一节', '展开一个就会收起另一个。')}
            {item('b', '第二节', '这是手风琴，不是组件的一个模式——由你的状态决定。')}
            {item('c', '第三节', '组件本身不知道彼此存在。')}
          </div>;
        },
        code: `const [open, setOpen] = useState<string | null>('a');

<DisclosureGroup label="第一节"
  open={open === 'a'}
  onOpenChange={next => setOpen(next ? 'a' : null)}>…</DisclosureGroup>`,
      },
      {
        id: 'disclosure-in-list', title: '放在设置里', description: '和列表排在一起时，最常用的行在上面，折叠区在下面。',
        height: 300,
        render: function DisclosureInList() {
          return <div style={{ display: 'grid', gap: 16, width: 360 }}>
            <List>
              <ListSection headingLevel={4} header="网络">
                <ListRow label="自动连接" value="开" onSelect={() => {}} />
              </ListSection>
            </List>
            <DisclosureGroup label="高级网络设置" secondaryLabel="DNS、代理、MTU">
              <Text variant="subhead" tone="secondary">改这些之前最好知道自己在做什么。</Text>
            </DisclosureGroup>
          </div>;
        },
        code: `<List>…最常用的行…</List>
<DisclosureGroup label="高级网络设置">…</DisclosureGroup>`,
      },
    ],
    props: [
      { name: 'label', type: 'ReactNode', required: true, description: '藏的是什么。要说得出具体内容。' },
      { name: 'secondaryLabel', type: 'ReactNode', description: '第二行补充。' },
      { name: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: '自己控制，或交给组件。' },
    ],
    notes: [
      '底层是原生 `<details>`：浏览器的页内查找命中里面的文字会自动展开它，摘要本身对读屏就是一个带展开状态的按钮，回车和空格本来就能用。用 div 加 onClick 重做一遍，会把第一条悄悄丢掉。',
      '高度动画在支持 `interpolate-size` 的浏览器上交给浏览器，否则量一次内容高度。开启「减少动效」后直接显示。',
    ],
    related: ['list', 'card', 'text'],
  },
  {
    slug: 'grid', name: 'Grid', title: '网格', group: '内容',
    summary: '一组同类的东西，按空间自己排成几列。',
    when: [
      '照片、卡片、图标这类同一种东西排在一起的时候。',
      '给 minItemWidth，不要给断点列表——网格被告知「一项最窄多少」，列数它自己算，所以放进侧栏、放进分栏的中间列、和铺满整宽都对。',
      '每项周围要留出它自己的选中和焦点效果的余地，否则焦点环会被画到下一项底下——只有用键盘的人看得见。',
      '**不做虚拟化。** 那是另一个组件、另一组取舍，在这里做半截会让以后做真的那个更难。',
    ],
    examples: [
      {
        id: 'grid-auto', title: '按空间自动排列', description: '把窗口拉窄，列数自己变。minItemWidth 是一项最窄多少，不是列数。',
        height: 340,
        knobs: [
          { name: 'minItemWidth', label: '一项最窄', type: 'number', value: 140, min: 80, max: 320, step: 20 },
          { name: 'gap', label: '间距', type: 'number', value: 12, min: 8, max: 32, step: 4 },
        ],
        render: function GridAuto({ knobs }) {
          return <Grid id="grid-auto-demo" minItemWidth={Number(knobs.minItemWidth)} gap={Number(knobs.gap)} style={{ width: '100%' }}>
            {['封面', '背景', '图标', '插画', '头像', '横幅'].map(name => <Card key={name} radius={14} padding={16} fill="secondary">
              <Text variant="subhead">{name}</Text>
              <Text variant="caption1" tone="secondary">1280 × 720</Text>
            </Card>)}
          </Grid>;
        },
        code: knobs => `<Grid minItemWidth={${knobs.minItemWidth}} gap={${knobs.gap}}>
  {items.map(item => <Card key={item.id}>…</Card>)}
</Grid>`,
      },
      {
        id: 'grid-fixed', title: '固定列数', description: '只有在「几列」本身就是设计的一部分时才写死。',
        height: 260,
        render: () => <Grid id="grid-fixed-demo" columns={3} gap={12} style={{ width: '100%' }}>
          {[1, 2, 3, 4, 5, 6].map(n => <Card key={n} radius={14} padding={16} fill="secondary">
            <Text variant="subhead">第 {n} 格</Text>
          </Card>)}
        </Grid>,
        code: `<Grid columns={3} gap={12}>…</Grid>`,
      },
      {
        id: 'grid-focus', title: '焦点留白', description: '每项的焦点环要有地方画，而那个地方就是 gap——所以 gap 有一个 8 的下限。用 Tab 走一遍看看环有没有压到邻居。',
        height: 260,
        render: () => <Grid id="grid-focus-demo" minItemWidth={120} gap={20} style={{ width: '100%' }}>
          {['一', '二', '三', '四'].map(name => <GlassButton key={name} variant="gray">{name}</GlassButton>)}
        </Grid>,
        code: `<Grid minItemWidth={120} gap={20}>
  {items.map(item => <GlassButton key={item}>{item}</GlassButton>)}
</Grid>`,
      },
    ],
    props: [
      { name: 'minItemWidth', type: 'number', default: '220', description: '一项最窄多少。列数由它算出来。' },
      { name: 'columns', type: 'number', description: '写死列数。只在「几列」本身是设计时用。' },
      { name: 'gap', type: 'number', default: '16', description: '项之间的间距，下限 8——焦点环要有地方画。传更小的值开发模式会告警。' },
    ],
    notes: [
      '用的是 auto-fill + minmax，容器比一项还窄时也不会溢出。',
      '内容层。网格上的东西是内容；玻璃属于浮在它们上面的那一层。',
    ],
    related: ['card', 'list', 'form'],
  },
  {
    slug: 'form', name: 'Form', title: '表单', group: '内容',
    summary: '设置页那种表单：分组、每行一个带标签的控件。',
    when: [
      '一组设置、一份资料、一个需要填的表。',
      '分区标题用正常大小写，不用全大写——全大写的段标题在 iOS 26 就退休了。',
      '开关、步进器这类短控件用 inline；文本框用 stacked，因为标签在窄屏下会换行。',
    ],
    examples: [
      {
        id: 'form-basic', title: '基础用法', description: '行负责排布和分组，命名留在控件自己身上——库里每个控件本来就要求有自己的名字。',
        height: 400,
        knobs: [
          { name: 'description', label: '显示第二行', type: 'boolean', value: true },
          { name: 'footer', label: '显示分区说明', type: 'boolean', value: true },
        ],
        render: function FormBasic({ knobs }) {
          const [wifi, setWifi] = useState(true);
          const [roam, setRoam] = useState(false);
          const [copies, setCopies] = useState(2);
          return <Form id="form-basic-demo" style={{ width: 360 }} onSubmit={event => event.preventDefault()}>
            <FormSection header="网络" footer={knobs.footer === true ? '这些设置只影响这个演示。' : undefined}>
              <FormRow label="Wi‑Fi" description={knobs.description === true ? '连接到可用的网络' : undefined}>
                <GlassSwitch aria-label="Wi‑Fi" checked={wifi} onCheckedChange={setWifi} />
              </FormRow>
              <FormRow label="数据漫游">
                <GlassSwitch aria-label="数据漫游" checked={roam} onCheckedChange={setRoam} />
              </FormRow>
              <FormRow label="份数">
                <GlassStepper aria-label="份数" value={copies} onValueChange={setCopies} min={1} max={9} />
              </FormRow>
            </FormSection>
          </Form>;
        },
        code: knobs => `<Form>
  <FormSection header="网络"${knobs.footer ? ' footer="说明文字"' : ''}>
    <FormRow label="Wi‑Fi"${knobs.description ? ' description="连接到可用的网络"' : ''}>
      <GlassSwitch aria-label="Wi‑Fi" checked={wifi} onCheckedChange={setWifi} />
    </FormRow>
  </FormSection>
</Form>`,
      },
      {
        id: 'form-stacked', title: '文本框用 stacked', description: '控件放到标签下面一行。错误文案挂在 aria-describedby 上，不是只标红。',
        height: 380,
        render: function FormStacked() {
          const [email, setEmail] = useState('not-an-email');
          const invalid = email !== '' && !email.includes('@');
          return <Form id="form-stacked-demo" style={{ width: 360 }} onSubmit={event => event.preventDefault()}>
            <FormSection header="账户">
              <FormRow layout="stacked" label="电子邮件" error={invalid ? '请填写一个完整的邮箱地址。' : undefined}>
                <TextField labelHidden label="电子邮件" value={email} inputMode="email" autoComplete="email"
                  onChange={event => setEmail(event.currentTarget.value)} />
              </FormRow>
              <FormRow layout="stacked" label="个人简介">
                <TextField multiline labelHidden label="个人简介" rows={3} placeholder="两三句话" />
              </FormRow>
            </FormSection>
          </Form>;
        },
        code: `<FormRow layout="stacked" label="电子邮件" error={invalid ? '请填写完整的邮箱地址。' : undefined}>
  <TextField labelHidden label="电子邮件" value={email} onChange={…} />
</FormRow>`,
      },
      {
        id: 'form-submit', title: '提交',
        description: '是真正的 form：在任何一个输入框里按回车都会提交，浏览器也能自动填充。主操作只有一个，取消是扁平按钮。',
        height: 400,
        render: function FormSubmit() {
          const [name, setName] = useState('');
          const [sent, setSent] = useState(false);
          return <Form id="form-submit-demo" style={{ width: 360 }}
            onSubmit={event => { event.preventDefault(); setSent(true); }}>
            <FormSection header="新建工作区" footer="名字之后还能改。">
              <FormRow layout="stacked" label="名称">
                <TextField labelHidden label="名称" value={name} autoComplete="off"
                  placeholder="例如「设计」" onChange={event => { setName(event.currentTarget.value); setSent(false); }} />
              </FormRow>
            </FormSection>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <GlassButton variant="plain" type="button" onClick={() => { setName(''); setSent(false); }}>清空</GlassButton>
              <GlassButton variant="glassProminent" type="submit" disabled={!name}>创建</GlassButton>
            </div>
            <Text variant="caption1" tone="secondary" role="status">{sent ? `已创建「${name}」` : '在输入框里按回车也能提交。'}</Text>
          </Form>;
        },
        code: `<Form onSubmit={create}>
  <FormSection header="新建工作区">
    <FormRow layout="stacked" label="名称">
      <TextField labelHidden label="名称" value={name} onChange={…} />
    </FormRow>
  </FormSection>
  <GlassButton variant="glassProminent" type="submit">创建</GlassButton>
</Form>`,
      },
    ],
    props: [
      { name: 'header / footer', type: 'ReactNode', description: 'FormSection：分区标题与下方说明。标题是真正的 heading。' },
      { name: 'label', type: 'ReactNode', required: true, description: 'FormRow：这个控件是做什么的。' },
      { name: 'description', type: 'ReactNode', description: 'FormRow：标签下面的第二行。' },
      { name: 'error', type: 'ReactNode', description: 'FormRow：这一行的错误。挂在 aria-describedby 上。' },
      { name: 'layout', type: "'inline' | 'stacked'", default: "'inline'", description: '控件和标签同行，还是在下一行。' },
    ],
    notes: [
      '是真正的 `<form>`：回车提交、浏览器能自动填充、提交按钮名副其实。',
      '行的标题是 span 不是 label。把控件包进 label 让那行字也能点，是想当然的写法——但 GlassSwitch 和 TextField 自己就渲染 label，而 HTML 不允许 label 套 label。浏览器不会报错：实测在 Chrome 里点外层那行字，开关照样会翻，所以这个写法看起来是成立的。它错在名字——里外两个 label 各给控件贴一个名，读屏把同一句话念两遍。想让文字也能点，用控件自己的可见标签槽（GlassSwitch 的 label、字段的 labelHidden），让它自己拥有那行字。',
      '分区标题是真 heading，读屏可以在分区之间跳；分区说明挂在 aria-describedby 上。',
    ],
    related: ['list', 'text-field', 'switch'],
    imports: ['Form', 'FormSection', 'FormRow'],
  },
  {
    slug: 'material-view', name: 'MaterialView', title: '标准材质', group: '内容',
    summary: '内容里需要半透明时用它——比如照片上的说明文字底衬。',
    when: [
      '文字压在照片或视频上，需要一层底衬才看得清。',
      '想要半透明，但这块东西是内容的一部分、并没有浮在内容之上。',
      '四档厚度按用途选：文字多就厚一点，想多透出背景就薄一点。',
    ],
    examples: [
      {
        id: 'material-thickness', title: '四档厚度', description: '越厚文字对比越高，越薄保留的背景越多。切到图片背景更容易看出差别。',
        backdrop: 'both', height: 300,
        render: () => <div style={{ display: 'grid', gap: 10, width: 260 }}>
          {([['ultraThin', '最薄'], ['thin', '薄'], ['regular', '标准'], ['thick', '厚']] as const).map(([thickness, label]) =>
            <MaterialView key={thickness} thickness={thickness} radius={14} style={{ padding: 12 }}>
              <Text variant="subhead" emphasized>{label}</Text>
              <Text variant="caption1" tone="secondary">thickness=&quot;{thickness}&quot;</Text>
            </MaterialView>)}
        </div>,
        code: `<MaterialView thickness="regular" radius={14}>
  <Text variant="body">压在照片上也读得清的说明</Text>
</MaterialView>`,
      },
      {
        id: 'material-caption', title: '照片上的说明',
        description: '这是标准材质最常见的用处：文字压在图上，底下垫一层，图还看得见，字也读得清。',
        backdrop: 'media', height: 260,
        knobs: [
          { name: 'thickness', label: '厚度', type: 'select', value: 'regular', options: [
            { value: 'ultraThin', label: '最薄' }, { value: 'thin', label: '薄' },
            { value: 'regular', label: '标准' }, { value: 'thick', label: '厚' },
          ] },
          { name: 'radius', label: '圆角', type: 'number', value: 16, min: 0, max: 26, step: 2 },
        ],
        render: function MaterialCaption({ knobs }) {
          return <MaterialView id="material-caption-demo" thickness={knobs.thickness as 'regular'}
            radius={Number(knobs.radius)} style={{ padding: 14, width: 280 }}>
            <Text variant="headline">阿尔卑斯的早晨</Text>
            <Text variant="footnote" tone="secondary">海拔 2,840 米 · 6:12</Text>
          </MaterialView>;
        },
        code: knobs => `<MaterialView thickness="${knobs.thickness}" radius={${knobs.radius}}>
  <Text variant="headline">阿尔卑斯的早晨</Text>
  <Text variant="footnote" tone="secondary">海拔 2,840 米</Text>
</MaterialView>`,
      },
      {
        id: 'material-not-glass', title: '它不是玻璃',
        description: '标准材质属于内容层：它待在原地，跟着内容一起滚。玻璃属于浮在内容之上的那一层。把两者调换，页面就会既没有层次、浮起来的东西也不再显眼。',
        backdrop: 'media', height: 260,
        render: () => <div id="material-not-glass-demo" style={{ display: 'grid', gap: 12, width: 280 }}>
          <MaterialView thickness="regular" radius={16} style={{ padding: 12 }}>
            <Text variant="subhead" emphasized>内容层：标准材质</Text>
            <Text variant="caption1" tone="secondary">说明、字幕、图注</Text>
          </MaterialView>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassButton variant="glassProminent">浮动层：玻璃</GlassButton>
          </div>
        </div>,
        code: `{/* 内容层 */}
<MaterialView thickness="regular">图注</MaterialView>

{/* 浮动层 */}
<GlassButton variant="glassProminent">播放</GlassButton>`,
      },
    ],
    props: [
      { name: 'thickness', type: "'ultraThin' | 'thin' | 'regular' | 'thick'", default: "'regular'", description: '按用途选，不要按它在当前背景上的颜色选。' },
      { name: 'radius', type: 'number', default: '20', description: '圆角。' },
    ],
    notes: [
      '最薄的两档上不要用最淡的那级文字颜色，对比度不够。',
      '用户打开“减少透明度”后会自动变成实色底。',
    ],
    related: ['card', 'sidebar'],
  },
  {
    slug: 'divider', name: 'Divider', title: '分隔线', group: '内容',
    summary: '内容之间的一条细线。',
    when: [
      '两段内容之间需要一个明确的界线，而留白不够用的时候。',
      '工具栏和导航栏不需要它：那里的分隔来自材质本身。',
    ],
    examples: [
      {
        id: 'divider-basic', title: '横向与内缩', description: '内缩值让线和文字起始位置对齐，而不是贴着容器边。',
        height: 210,
        knobs: [{ name: 'inset', label: '起始侧内缩', type: 'number', value: 32, min: 0, max: 64, step: 8 }],
        render: function DividerBasic({ knobs }) {
          return <div id="divider-basic-demo" style={{ width: 280 }}>
            <Text variant="body">上一段</Text>
            <Divider style={{ marginBlock: 12 }} />
            <Text variant="body">下一段</Text>
            <Divider inset={Number(knobs.inset)} style={{ marginBlock: 12 }} />
            <Text variant="footnote" tone="secondary">这条向起始侧内缩了 {String(knobs.inset)}</Text>
          </div>;
        },
        code: knobs => `<Divider />
<Divider inset={${knobs.inset}} />`,
      },
      {
        id: 'divider-vertical', title: '竖向', description: '用在一行并排的内容之间。',
        height: 150,
        render: () => <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 40 }}>
          <Text variant="body">左</Text>
          <Divider orientation="vertical" />
          <Text variant="body">中</Text>
          <Divider orientation="vertical" />
          <Text variant="body">右</Text>
        </div>,
        code: `<Divider orientation="vertical" />`,
      },
      {
        id: 'divider-when-not', title: '什么时候不该用',
        description: '列表自己带分隔线，工具栏和导航栏的分隔来自材质本身。在这些地方再加一条，就是把系统已经做过的事又做了一遍，而且做得更重。',
        height: 260,
        render: () => <div id="divider-when-not-demo" style={{ display: 'grid', gap: 16, width: 300 }}>
          <List>
            <ListSection headingLevel={4} header="列表自己就有线">
              <ListRow label="第一行" />
              <ListRow label="第二行" />
            </ListSection>
          </List>
          <Text variant="footnote" tone="secondary">
            两行之间那条线是列表画的。再放一个 Divider 只会得到两条。
          </Text>
        </div>,
        code: `{/* 不需要：列表自己有 */}
<ListRow label="第一行" />
<ListRow label="第二行" />

{/* 需要：两段松散内容之间 */}
<section>…</section>
<Divider />
<section>…</section>`,
      },
    ],
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '方向。' },
      { name: 'inset', type: 'number', default: '0', description: '起始侧内缩。从右到左的语言里会自动翻转。' },
    ],
    notes: ['读屏会把它识别为分隔符，并知道是横是竖。'],
    related: ['list', 'toolbar'],
  },
  {
    slug: 'group-box', name: 'GroupBox', title: '分组框', group: '内容',
    summary: '把相关的内容圈在一起，上面可以有一个小标题。',
    when: [
      '几个控件属于同一件事，但还不到单独开一页的程度——导出设置、一组开关。',
      '相对容器要小。一个和窗口一样大的框已经不再"把内容分出来"了，它只是又画了一层边。',
      '不要嵌套。里面还要分组就用留白和对齐，框里再套框会让界面看起来又挤又碎。',
    ],
    examples: [
      {
        id: 'groupbox-basic', title: '标题在框外面',
        description: 'macOS 把分组框的标题画在框的上方，这里也一样。标题用正常大小写，末尾不加标点。',
        height: 260,
        knobs: [
          { name: 'variant', label: '分隔方式', type: 'select', value: 'fill', options: [
            { value: 'fill', label: '底色' }, { value: 'outline', label: '描边' },
          ] },
          { name: 'description', label: '加一行说明', type: 'boolean', value: false },
        ],
        render: function GroupBoxBasic({ knobs }) {
          const [wifi, setWifi] = useState(true);
          const [roam, setRoam] = useState(false);
          return <div style={{ width: 320 }}>
            <GroupBox title="网络" variant={knobs.variant as 'fill'}
              description={knobs.description === true ? '只影响这台设备' : undefined}>
              <GlassSwitch aria-label="Wi-Fi" label="Wi-Fi" checked={wifi} onCheckedChange={setWifi} />
              <GlassSwitch aria-label="数据漫游" label="数据漫游" checked={roam} onCheckedChange={setRoam} />
            </GroupBox>
          </div>;
        },
        code: knobs => `<GroupBox title="网络"${knobs.variant === 'fill' ? '' : `\n  variant="outline"`}${knobs.description ? `\n  description="只影响这台设备"` : ''}>
  <GlassSwitch label="Wi-Fi" … />
  <GlassSwitch label="数据漫游" … />
</GroupBox>`,
      },
      {
        id: 'groupbox-vs-card', title: '和卡片的区别',
        description: '卡片是一块承载内容的面，它有底色、圆角和阴影，是你在信息流里点的那个东西。分组框是一圈边界，说明这几样东西是一伙的，标题属于这个分组而不属于内容。',
        height: 300,
        render: () => <div id="groupbox-vs-card-demo" style={{ display: 'grid', gap: 16, width: 340 }}>
          <GroupBox title="导出" variant="outline">
            <Text variant="subhead">这三项一起决定导出的结果。</Text>
          </GroupBox>
          <Card radius={16} padding={16}>
            <Text variant="subhead">这是一张卡片：一条动态、一份文档、一个可以点进去的东西。</Text>
          </Card>
        </div>,
        code: `{/* 一圈边界，说明这几样是一伙的 */}
<GroupBox title="导出">…</GroupBox>

{/* 一块承载内容的面 */}
<Card>…</Card>`,
      },
      {
        id: 'groupbox-nesting', title: '不要框里套框',
        description: '框的边是一个很明确的视觉元素，套两层之后读者要数边才知道自己在第几层。里面还要分组，用留白和对齐。',
        height: 340,
        render: () => <div id="groupbox-nesting-demo" style={{ display: 'grid', gap: 16, width: 320 }}>
          <GroupBox title="用留白分组" variant="outline">
            <Text variant="caption1" tone="tertiary">尺寸</Text>
            <Text variant="subhead">宽 1200 · 高 720</Text>
            <div style={{ height: 8 }} />
            <Text variant="caption1" tone="tertiary">格式</Text>
            <Text variant="subhead">PNG · 2 倍</Text>
          </GroupBox>
          <GroupBox title="不要这样" variant="outline">
            <GroupBox title="尺寸" variant="outline"><Text variant="subhead">宽 1200 · 高 720</Text></GroupBox>
          </GroupBox>
        </div>,
        code: `{/* 好：一层框，里面靠留白分 */}
<GroupBox title="导出">
  <Text variant="caption1" tone="tertiary">尺寸</Text>
  …
</GroupBox>

{/* 不好：框里套框 */}
<GroupBox title="导出"><GroupBox title="尺寸">…</GroupBox></GroupBox>`,
      },
    ],
    props: [
      { name: 'title', type: 'ReactNode', description: '画在框上方的小标题，同时作为这个分组的无障碍名称。' },
      { name: 'description', type: 'ReactNode', description: '标题下面的一行说明，标题说不完的时候用。' },
      { name: 'variant', type: "'fill' | 'outline'", default: "'fill'", description: '用底色还是描边来分隔。两样一起用就是框里套框。' },
      { name: 'radius', type: 'number', default: '14', description: '圆角，单位 px。里面的 Concentric 会据此算自己的圆角。' },
      { name: 'padding', type: 'number', default: '16', description: '内边距，单位 px。' },
    ],
    notes: [
      '框本身是 role="group"，标题通过 aria-labelledby 绑上去——读屏会先说这个分组叫什么，再读里面的内容。',
      '没有标题时不会硬造一个名字：一个没名字的分组，读屏当作普通容器带过，这比念一句"组"有用。',
      '内容层，永远不是玻璃。它是页面的一块区域，不是浮在页面上的东西。',
    ],
    related: ['card', 'form', 'list'],
  },
  {
    slug: 'outline-view', name: 'OutlineView', title: '大纲视图', group: '内容',
    summary: '有层级的数据，能一层层展开收起，键盘可以整棵树走完。',
    when: [
      '数据本身是嵌套的——文件夹、章节、图层、组织架构。',
      '不嵌套就别用。并排的一堆东西用 List，它更轻、也不会让人去找不存在的三角形。',
      '通常放在分栏视图的左列，右边放选中的那一项。',
      '需要多列（大小、修改日期、种类各占一列）时这个组件不够用，见下面最后一个示例。',
    ],
    examples: [
      {
        id: 'outline-basic', title: '展开和收起',
        description: '点三角形开合一层，按住 Option 再点会把这一支整个展开。点名字是选中，两件事互不干扰。',
        height: 400,
        knobs: [
          { name: 'defaultExpanded', label: '初始展开', type: 'select', value: 'top', options: [
            { value: 'none', label: '全部收起' }, { value: 'top', label: '第一层' }, { value: 'all', label: '全部' },
          ] },
        ],
        render: function OutlineBasic({ knobs }) {
          const preset = knobs.defaultExpanded as string;
          const expanded = preset === 'none' ? [] : preset === 'top' ? ['docs'] : ['docs', 'drafts', 'images'];
          /* `defaultExpanded` 只在挂载时读一次，所以换档位时让它重新挂载——这正是这个属性的
             语义，用 state 假装它会跟着变反而会骗人。 */
          return <div id="outline-basic-demo" style={{ width: 300 }}>
            <OutlineView key={preset} aria-label="项目文件" items={projectTree}
              defaultExpanded={expanded} defaultSelected="proposal" />
          </div>;
        },
        code: knobs => `<OutlineView
  aria-label="项目文件"
  items={items}
  defaultExpanded={${knobs.defaultExpanded === 'none' ? '[]'
    : knobs.defaultExpanded === 'top' ? "['docs']" : "['docs', 'drafts', 'images']"}}
  defaultSelected="proposal"
/>`,
      },
      {
        id: 'outline-keyboard', title: '键盘走完整棵树',
        description: '整棵树在 Tab 顺序里只占一个位置，进去之后：↑ ↓ 逐行，→ 展开再进去，← 收起再退回上一层，Home / End 到头，直接打字跳到对应的名字，Enter 或空格选中。',
        height: 400,
        render: function OutlineKeyboard() {
          const [open, setOpen] = useState<string[]>(['docs', 'images']);
          const [picked, setPicked] = useState<string | null>('cover');
          return <div id="outline-keyboard-demo" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, width: '100%', maxWidth: 460 }}>
            <OutlineView aria-label="项目文件" items={projectTree}
              expanded={open} onExpandedChange={setOpen}
              selected={picked} onSelect={key => setPicked(key)} />
            <Card radius={14} padding={16}>
              <Text variant="caption1" tone="tertiary">当前选中</Text>
              <Text variant="body" id="outline-picked">{picked ?? '什么都没选'}</Text>
            </Card>
          </div>;
        },
        code: `const [open, setOpen] = useState(['docs', 'images']);
const [picked, setPicked] = useState<string | null>('cover');

<OutlineView
  aria-label="项目文件"
  items={items}
  expanded={open} onExpandedChange={setOpen}
  selected={picked} onSelect={key => setPicked(key)}
/>`,
      },
      {
        id: 'outline-remember', title: '记住展开到哪里',
        description: '哪些文件夹是开着的由你来存。库里不替你存：它不知道该存到哪，而悄悄放在组件自己的 state 里，看起来是好的，下次进来全没了。',
        height: 380,
        render: function OutlineRemember() {
          const [open, setOpen] = useState<string[]>(['docs', 'drafts']);
          return <div id="outline-remember-demo" style={{ display: 'grid', gap: 12, width: 300 }}>
            <OutlineView aria-label="项目文件" items={projectTree} expanded={open} onExpandedChange={setOpen} />
            <Text variant="caption1" tone="tertiary" id="outline-open-keys">
              开着的：{open.length ? open.join('、') : '（没有）'}
            </Text>
          </div>;
        },
        code: `const [open, setOpen] = useState(
  () => JSON.parse(localStorage.getItem('open') ?? '[]'),
);

<OutlineView
  aria-label="项目文件"
  items={items}
  expanded={open}
  onExpandedChange={next => {
    setOpen(next);
    localStorage.setItem('open', JSON.stringify(next));
  }}
/>`,
      },
      {
        id: 'outline-not-a-table', title: '一列，不是一张表',
        description: '层级只出现在第一列，右边那串数字是同一行上的读数，不是第二列。真正的多列大纲（可排序的列头、可拖的列宽、方向键在单元格之间走）是另一种东西，这个组件不是它——做一半的话，它对谁都不像表格。数据本来就不嵌套的，用 List。',
        height: 360,
        render: () => <div id="outline-not-a-table-demo" style={{ display: 'grid', gap: 16, width: 320 }}>
          <OutlineView aria-label="有层级的" items={projectTree} defaultExpanded={['images']} />
          <Divider />
          <List variant="insetGrouped">
            <ListSection header="没有层级的">
              <ListRow label="封面.png" value="1.2 MB" />
              <ListRow label="图表.png" value="640 KB" />
            </ListSection>
          </List>
        </div>,
        code: `{/* 嵌套的 */}
<OutlineView aria-label="项目文件" items={items} />

{/* 并排的 */}
<List>
  <ListRow label="封面.png" value="1.2 MB" />
</List>`,
      },
    ],
    props: [
      { name: 'items', type: 'OutlineNode[]', description: '整棵树。每个节点要 key 和 label，可选 icon（前导图形）、value（同一行右侧的读数）、disabled；children 为 undefined 是叶子，为空数组是一个空的容器。' },
      { name: 'aria-label', type: 'string', description: '这棵树叫什么。单列大纲没有列头替它说。' },
      { name: 'expanded', type: 'string[]', description: '展开着的容器的 key。受控。' },
      { name: 'defaultExpanded', type: 'string[]', default: '[]', description: '非受控时的初始展开。' },
      { name: 'onExpandedChange', type: '(keys: string[]) => void', description: '展开收起时回调，参数是新的全集。' },
      { name: 'selected', type: 'string | null', description: '选中行的 key。受控。' },
      { name: 'defaultSelected', type: 'string | null', default: 'null', description: '非受控时的初始选中。' },
      { name: 'onSelect', type: '(key: string, node: OutlineNode) => void', description: '选中变化时回调。' },
    ],
    notes: [
      'role="tree"，行是 treeitem，子列表是 group；每行带 aria-level，所以读屏会报"第几层"。',
      '整棵树在 Tab 顺序里只占一个位置：进去之后用方向键走，出来按 Tab。一个文件夹一个 Tab 位会让一棵树变成几十次 Tab。',
      '三角形不是按钮。treeitem 里再塞一个按钮，键盘模型里没有任何一个键能走到它，却要在每一行多按一次 Tab；开合状态由行自己的 aria-expanded 播报。',
      '收起的那一层用 content-visibility: hidden，不是 display: none——既留下一个可以做高度动画的盒子，又真的把里面的行移出无障碍树和页内查找。收起就是对所有人收起。',
      '打字跳转匹配的是按键直接产生的字符。经输入法组字打出来的中文不会以单字符按键的形式到达，所以中文名字请用方向键走——这一条对库里所有打字跳转的地方（菜单、命令面板）都一样。',
      '名字太长时末尾省略。HIG 更希望省略号在中间，CSS 没有这个能力，所以这里是末尾——不假装。',
    ],
    related: ['list', 'split-view', 'disclosure'],
  },
];

/** The tree the outline demos share, so the page reads as one file hierarchy rather than four. */
const folder = <Icon name="folder" size={15} />;
const doc = <Icon name="doc" size={15} />;
const projectTree: OutlineNode[] = [
  {
    key: 'docs', label: '文稿', icon: folder, children: [
      { key: 'proposal', label: '提案.pages', icon: doc, value: '248 KB' },
      { key: 'drafts', label: '草稿', icon: folder, children: [
        { key: 'proposal-old', label: '提案 旧.pages', icon: doc, value: '240 KB' },
        { key: 'notes', label: '会议记录.md', icon: doc, value: '12 KB' },
      ] },
    ],
  },
  {
    key: 'images', label: '图片', icon: folder, children: [
      { key: 'cover', label: '封面.png', icon: doc, value: '1.2 MB' },
      { key: 'chart', label: '图表.png', icon: doc, value: '640 KB' },
    ],
  },
  { key: 'archive', label: '归档', icon: folder, children: [] },
  { key: 'readme', label: 'README.md', icon: doc, value: '4 KB' },
  { key: 'report', label: 'report.csv', icon: doc, value: '88 KB' },
  { key: 'locked', label: '不可用.key', icon: doc, value: '—', disabled: true },
];
