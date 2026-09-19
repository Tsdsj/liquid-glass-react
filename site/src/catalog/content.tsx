import { useState } from 'react';
import {
  Card, Concentric, DisclosureGroup, Divider, Form, FormRow, FormSection, GlassButton,
  GlassStepper, GlassSwitch, Grid, Kbd, LibraryIcon, TextField, List, ListRow, ListSection, MaterialView, Text,
} from '@ttqtt/liquid-glass-react';
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
          <Text as="h3" variant="largeTitle" emphasized>大标题</Text>
          <Text variant="title2" emphasized>二级标题</Text>
          <Text variant="headline">小标题会自动加粗</Text>
          <Text variant="body">正文。大段阅读用这一档。</Text>
          <Text variant="subhead" tone="secondary">次级说明</Text>
          <Text variant="footnote" tone="secondary">脚注</Text>
          <Text variant="caption2" tone="tertiary">最小的一档，11px</Text>
        </div>,
        code: `<Text as="h1" variant="largeTitle" emphasized>大标题</Text>
<Text variant="body">正文</Text>
<Text variant="footnote" tone="secondary">脚注</Text>`,
      },
      {
        id: 'text-tone', title: '强调与色调', description: '同一档字号下，用字重和颜色区分主次。',
        height: 200,
        render: () => <div style={{ display: 'grid', gap: 8, textAlign: 'start' }}>
          <Text variant="body" emphasized>加粗的正文</Text>
          <Text variant="body">默认正文</Text>
          <Text variant="body" tone="secondary">次要</Text>
          <Text variant="body" tone="tertiary">更次要</Text>
          <Text variant="body" tone="accent">强调色</Text>
          <Text variant="body" tone="destructive">危险操作</Text>
        </div>,
        code: `<Text variant="body" emphasized>加粗的正文</Text>
<Text variant="body" tone="secondary">次要</Text>
<Text variant="body" tone="destructive">危险操作</Text>`,
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
        height: 230,
        render: () => <div style={{ display: 'grid', gap: 12, width: 280 }}>
          <Card radius={20} padding={16}><Text variant="subhead">默认（分组背景）</Text></Card>
          <Card radius={20} padding={16} fill="secondary"><Text variant="subhead">次级背景</Text></Card>
          <Card radius={20} padding={16} raised><Text variant="subhead">带轻微投影</Text></Card>
        </div>,
        code: `<Card radius={20} padding={16}>内容</Card>
<Card fill="secondary">内容</Card>
<Card raised>内容</Card>`,
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
        height: 260,
        render: () => <List style={{ width: 320 }}>
          <ListSection header="显示与亮度" footer="这些设置只影响这个演示。">
            <ListRow label="外观" value="浅色" onSelect={() => {}} />
            <ListRow label="文字大小" secondaryLabel="影响整站排版" value="标准" onSelect={() => {}} />
          </ListSection>
        </List>,
        code: `<List>
  <ListSection header="显示与亮度" footer="说明文字">
    <ListRow label="外观" value="浅色" onSelect={open} />
    <ListRow label="文字大小" secondaryLabel="影响整站排版" value="标准" />
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
            <ListSection header="网络">
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
        id: 'kbd-basic', title: '基础用法', description: '写法随意：符号、单词、加号或空格分隔都行。',
        height: 190,
        render: () => <div id="kbd-basic-demo" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Kbd keys="⌘K" />
          <Kbd keys="Cmd+Shift+P" />
          <Kbd keys="ctrl alt delete" />
          <Kbd keys="esc" />
          <Kbd keys="up" />
        </div>,
        code: `<Kbd keys="⌘K" />
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
    ],
    props: [
      { name: 'keys', type: 'string', required: true, description: '快捷键。符号、单词、加号或空格分隔都认；认不出来的原样输出。' },
      { name: 'aria-label', type: 'string', description: '读屏听到的内容。默认是拼成单词的版本，比如「Command K」。' },
    ],
    notes: [
      '⌘ ⌥ ⇧ 这些符号读屏念不出来——有的直接跳过，有的念成「兴趣点符号」。所以元素自己带 aria-label，符号本身标了 aria-hidden。',
      '修饰键顺序由组件决定，不由传入顺序决定。',
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
        height: 250,
        render: function DisclosureBasic() {
          return <div id="disclosure-basic-demo" style={{ display: 'grid', gap: 10, width: 360 }}>
            <DisclosureGroup label="高级选项" secondaryLabel="代理、缓存与实验性功能">
              <Text variant="subhead" tone="secondary">这里放平时不需要动的设置。</Text>
            </DisclosureGroup>
            <DisclosureGroup label="为什么需要这个权限" defaultOpen>
              <Text variant="subhead" tone="secondary">默认展开——最需要被读到的那一段不该藏起来。</Text>
            </DisclosureGroup>
          </div>;
        },
        code: `<DisclosureGroup label="高级选项" secondaryLabel="代理、缓存与实验性功能">
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
              <ListSection header="网络">
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
        height: 320,
        render: () => <Grid id="grid-auto-demo" minItemWidth={140} gap={12} style={{ width: '100%' }}>
          {['封面', '背景', '图标', '插画', '头像', '横幅'].map(name => <Card key={name} radius={14} padding={16} fill="secondary">
            <Text variant="subhead">{name}</Text>
            <Text variant="caption1" tone="secondary">1280 × 720</Text>
          </Card>)}
        </Grid>,
        code: `<Grid minItemWidth={140} gap={12}>
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
        height: 380,
        render: function FormBasic() {
          const [wifi, setWifi] = useState(true);
          const [roam, setRoam] = useState(false);
          const [copies, setCopies] = useState(2);
          return <Form id="form-basic-demo" style={{ width: 360 }} onSubmit={event => event.preventDefault()}>
            <FormSection header="网络" footer="这些设置只影响这个演示。">
              <FormRow label="Wi‑Fi" description="连接到可用的网络">
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
        code: `<Form>
  <FormSection header="网络" footer="说明文字">
    <FormRow label="Wi‑Fi" description="连接到可用的网络">
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
      '行的标题是 span 不是 label。把控件包进 label 让那行字也能点，是想当然的写法——但 GlassSwitch 和 TextField 自己就渲染 label，label 套 label 非法，浏览器的答复是外面那个直接失效。而且库里每个控件本来就带自己的名字，包一层是加第二个名字。想让文字也能点，给控件 labelHidden，让它自己拥有那行字。',
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
        height: 190,
        render: () => <div style={{ width: 280 }}>
          <Text variant="body">上一段</Text>
          <Divider style={{ marginBlock: 12 }} />
          <Text variant="body">下一段</Text>
          <Divider inset={32} style={{ marginBlock: 12 }} />
          <Text variant="footnote" tone="secondary">这条向起始侧内缩了 32</Text>
        </div>,
        code: `<Divider />
<Divider inset={32} />`,
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
    ],
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '方向。' },
      { name: 'inset', type: 'number', default: '0', description: '起始侧内缩。从右到左的语言里会自动翻转。' },
    ],
    notes: ['读屏会把它识别为分隔符，并知道是横是竖。'],
    related: ['list', 'toolbar'],
  },
];
