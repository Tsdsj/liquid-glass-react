import { useState } from 'react';
import {
  Card, Concentric, Divider, GlassSwitch, LibraryIcon, List, ListRow, ListSection, MaterialView, Text,
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
