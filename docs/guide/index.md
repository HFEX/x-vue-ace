<script setup>
import {ref,reactive} from 'vue'
import XesEditor from '../../package/XVueAce.vue'
import "ace-builds/src-noconflict/theme-idle_fingers";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/worker-css.js";
import "ace-builds/src-noconflict/keybinding-vim";
const EditorStyle = ref("width:100%;height: 50px")
const fontSize = ref("20px")
const isShowGutter = ref(true);
const value = ref("")
const maxLines = ref(5)
const minLines = ref(5)
const isReadonly = ref(false)
const tabSize = ref(4)
const isShowPrintMargin = ref(false)
const isWrapEnabled = ref(false)
const enableMarkup = ref(false)
const markupText = ref(`<xiaohou-hide>123</xiaohou-hide>
<xiaohou-blank></xiaohou-blank>
<xiaohou-lock>lock can't edit</xiaohou-lock>
`)
const annotations = reactive([
  {
    row: 0,
    column: 2,
    type: "error",
    text: "Some error.",
  },
]);

const markers = reactive([
  {
    startRow: 0,
    startCol: 0,
    endRow: 0,
    endCol: 5,
    className: "error-marker",
    type: "text",
  },
]);
</script>
<style>
.error-marker {
  position: absolute;
  background-color: red;
}
</style>
# 开始
## 介绍

x-vue-ace 是使用`typescript`基于`ace`开发的Vue3组件。

> Ace是一个用JavaScript编写的可嵌入代码编辑器。它与Sublime，Vim和TextMate等本机编辑器的功能和性能相匹配。它可以轻松地嵌入任何网页和JavaScript应用程序中。

- 官网地址：[Ace - The High Performance Code Editor for the Web](https://ace.c9.io/ "Ace - The High Performance Code Editor for the Web")

- Github: [GitHub - ajaxorg/ace: Ace (Ajax.org Cloud9 Editor)](https://github.com/ajaxorg/ace/ "GitHub - ajaxorg/ace: Ace (Ajax.org Cloud9 Editor)")

## 在项目中使用

::: tip 兼容性注意
只能在Vue3项目中使用
:::

使用 NPM:

```bash
$ npm install x-vue-ace --save
```

使用 YARN

```bash
$ yarn add x-vue-ace
```

随后只需要像正常的组件一样使用就可以了

<<< ./examples/App.vue#snippet{1,5}

## props
### mode 

- Type: `string`
- Default: `python`

配置编辑器使用的语言。为了减少打包大小，未包含其他语言，如配置为其他类型，需要先手动引入。涉及高亮，自动补全相关的功能。

```ts
import "ace-builds/src-noconflict/mode-c-cpp";
```
```vue
  <XesEditor theme="chrome" mode="python"/>
```
  <XesEditor theme="chrome" mode="python" :style="EditorStyle" value="print(123)" fontSize="20pt" :enableLiveAutocompletion="true"/>
```vue
  <XesEditor theme="chrome" mode="css"/>
```
  <XesEditor theme="chrome" mode="css" :style="EditorStyle" value="#app{width: 100px;}" fontSize="20pt" :enableLiveAutocompletion="true"/>

### theme

- Type: `string`
- Default: `""`

配置编辑器使用的主题。为了减少打包大小，未包含其他主题，如配置为其他主题，需要先手动引入。涉及背景颜色，高亮颜色。

```ts
import "ace-builds/src-noconflict/theme-idle_fingers";
```
theme="chrome"
  <XesEditor theme="chrome" mode="python" :style="EditorStyle" value="print(123)" fontSize="20pt"/>
theme="idle_fingers"
<XesEditor theme="idle_fingers" mode="python" :style="EditorStyle" value="print(123)" fontSize="20pt"/>

### fontSize

- Type: `string|number`
- Default: `12`

配置编辑器的字体大小,可以为任意满足css字体大小的字符串，或者数字。当为数字时，单位默认为px。

<input v-model="fontSize">
<XesEditor theme="chrome" :style="EditorStyle" value="print(123)" :fontSize="fontSize"/>

### showGutter

- Type: `boolean`
- Default: `true`

是否显示代码行号,默认为true。
<input type="checkbox" v-model="isShowGutter"/>
<XesEditor :style="EditorStyle" :showGutter="isShowGutter" value="print(123)" fontSize="20pt"/>

### value

- Type: `string`
- Default: `""`

设置编辑器的初始值。更新后会重设编辑器内容。但只支持单向绑定。
<input v-model="value">
{{value}}
<XesEditor theme="chrome" :style="EditorStyle" :value="value" fontSize="20pt"/>

### minLines maxLines

- Type: `number`
- Default: `null`

设置编辑器可视范围的行数的最大最小值。用于撑开或者限制编辑区域高度

maxLines <input v-model.number="maxLines">

minLines <input v-model.number="minLines">

<XesEditor theme="chrome" value="print(123)" fontSize="20pt" :maxLines="maxLines" :minLines="minLines"/>


### readonly

- Type: `boolean`
- Default: `false`

是否只读<input type="checkbox" v-model="isReadonly"/>

<XesEditor theme="chrome" :style="EditorStyle" value="print(123)" fontSize="20pt" :readOnly="isReadonly"/>

### highlightActiveLine

- Type: `boolean`
- Default: `true`
  
是否高亮显示当前行。 这里有个bug，如果为`false`,会导致代码挖空的宽度无法实时更新

### tabSize

- Type: `number`
- Default: `4`

tab的宽度,只影响新的tab<input v-model.number="tabSize">

<XesEditor theme="chrome" :style="EditorStyle" value="print(123)" fontSize="20pt" :tabSize="tabSize"/>

### showPrintMargin

- Type: `boolean`
- Default: `false`

设置是否显示打印线，设置为true后，超宽会有一个竖线<input type="checkbox" v-model="isShowPrintMargin"/>

<XesEditor theme="chrome" :style="EditorStyle" value="1111111111111111111111111111111111111111111111111111111111111111111111111111111111" fontSize="20pt" :showPrintMargin="isShowPrintMargin"/>

### printMarginColumn(tofinish)

- Type: `number`
- Default: `80`

尚未支持 与上一项联动，当单行列数超过此项后会显示打印线

### cursorStart

- Type: `-1|0|1`
- Default: `1`

 > Where to set the new value. `undefined` or 0 is selectAll, -1 is at the document start, and 1 is at the end

貌似用处不大

### debounceChangePeriod

- Type: `number`
- Default: `undefined`

`change`事件的上报debounce间隔

### scrollMargin

- Type: `number[]`
- Default: `undefined`

设置编辑区域的margin

### keyboardHandler

- Type: `string`
- Default: `""`

设置快捷键类型。如`vim`,需要额外引入对应的js文件

```ts
import "ace-builds/src-noconflict/keybinding-vim";
```
<XesEditor theme="chrome" style="height:300px" value="print(123)" fontSize="20pt" keyboardHandler="vim"/>

### wrapEnabled

- Type: `boolean`
- Default: `false`

是否允许自动换行<input type="checkbox" v-model="isWrapEnabled">

<XesEditor theme="chrome" mode="text" style="height:200px" value="当有殿头官喝道：“有事出班早奏，无事卷帘退朝。”只见班部丛中，宰相赵哲、参政文彦博出班奏曰：“目今京师瘟疫盛行，伤损军民甚多。伏望陛下释罪宽恩，省刑薄税，以禳天灾，救济万民。”天子听奏，急敕翰林院随即草诏：一面降赦天下罪囚，应有民间税赋悉皆赦免；一面命在京宫观寺院，修设好事禳灾。不料其年瘟疫转盛。仁宗天子闻知，龙体不安，复会百官计议。向那班部中，有一大臣越班启奏。天子看时，乃是参知政事范仲淹。拜罢起居，奏曰∶“目今天灾盛行，军民涂炭，日夕不能聊生。以臣愚意，要禳此灾，可宣嗣汉天师星夜临朝，就京师禁院修设三千六百分罗天大醮，奏闻上帝，可以禳保民间瘟疫。”仁宗天子准奏。急令翰林学士草诏一道，天子御笔亲书，并降御香一柱，钦差内外提点殿前大尉洪信为天使，前往江西信州龙虎山，宣请嗣汉夭师张真人星夜来朝，祈禳瘟疫。就金殿上焚起御香，亲将丹诏付与洪大尉为使，即便登程前去。" fontSize="20pt" :wrapEnabled="isWrapEnabled"/>

### enableBasicAutocompletion

- Type: `boolean`
- Default: `false`

是否开启基础的自动补全(基本不用这个)

### enableLiveAutocompletion

- Type: `Completer[] | boolean`
- default: `false`

是否开启动态自动补全功能。
当传入true时，会根据`mode`选择的语言去生成自动补全
也可以传入一个数组，配置自己的期望的自动补全,相关类型声明如下

<<< ./package/utils/Completers.ts

### navigateToFileEnd

- Type: `Boolean`
- default: `false`

将光标移动到文件末尾

<XesEditor theme="chrome" mode="text" style="height:200px" value="当有殿头官喝道：“有事出班早奏，无事卷帘退朝。”只见班部丛中，宰相赵哲、参政文彦博出班奏曰：“目今京师瘟疫盛行，伤损军民甚多。伏望陛下释罪宽恩，省刑薄税，以禳天灾，救济万民。”天子听奏，急敕翰林院随即草诏：一面降赦天下罪囚，应有民间税赋悉皆赦免；一面命在京宫观寺院，修设好事禳灾。不料其年瘟疫转盛。仁宗天子闻知，龙体不安，复会百官计议。向那班部中，有一大臣越班启奏。天子看时，乃是参知政事范仲淹。拜罢起居，奏曰∶“目今天灾盛行，军民涂炭，日夕不能聊生。以臣愚意，要禳此灾，可宣嗣汉天师星夜临朝，就京师禁院修设三千六百分罗天大醮，奏闻上帝，可以禳保民间瘟疫。”仁宗天子准奏。急令翰林学士草诏一道，天子御笔亲书，并降御香一柱，钦差内外提点殿前大尉洪信为天使，前往江西信州龙虎山，宣请嗣汉夭师张真人星夜来朝，祈禳瘟疫。就金殿上焚起御香，亲将丹诏付与洪大尉为使，即便登程前去。" fontSize="20pt" :wrapEnabled="true" :navigateToFileEnd="true"/>

### commands

- Type: `any[]`
- default: `[]`

自定义快捷键（还没支持）

### placeholder

- Type: `string`
- Default: `""`

placeholder
  <XesEditor theme="chrome" mode="python" :style="EditorStyle" value="" placeholder="placeholder" fontSize="20pt" :enableLiveAutocompletion="true"/>

### preventPasteOther

- Type: `Boolean`
- default: `false`

阻止粘贴到其他编辑器,在源编辑器设置，然后目标编辑器不需要设置
<XesEditor theme="chrome" :style="EditorStyle" value="print(123)" fontSize="20pt" preventPasteOther/>

<XesEditor theme="chrome" :style="EditorStyle" placeholder="阻止粘贴" fontSize="20pt"/>

### markup
- Type: `Boolean`
- default: `true`

是否开启代码挖空,与代码隐藏以及代码锁定。
开启后会隐藏`<xiaohou-blank></xiaohou-blank>`中的内容，如果有`<xiaohou-blank></xiaohou-blank>`,会阻止在标签外的输入行为,如果不存在代码挖空，`<xiaohou-lock></xiaohou-lock>`内的内容无法编辑。<input type="checkbox" v-model="enableMarkup">

<XesEditor theme="chrome" mode="text" style="height:130px" :value="markupText" fontSize="20pt" :markup="enableMarkup"/>

### annotations
- Type: `Annotation[]`
- default: `[]`

```ts
  export interface Annotation {
    row?: number;
    column?: number;
    text: string;
    type: 'error'|'warning'|'info';
  }
```
一个注释机制，能够在行号出显示提示。

<XesEditor theme="chrome" mode="text" :style="EditorStyle" value="print(123)" fontSize="20pt" :annotations="annotations"/>

### markers
- Type: `marker[]`
- default: []

<<< ./package/types/props.ts#markerType
另一种报错机制,需要注意的是，这里需要自己配置颜色样式
```css
.error-marker {
  position: absolute;
  background-color: red;
}
```
<XesEditor theme="chrome" mode="text" :style="EditorStyle" value="print(123)" fontSize="20pt" :markers="markers"/>

## 事件
### change
- payload: 
  - value: `string` 编辑器新内容
  - event: `event` event事件，包含光标位置，输入还是删除
  - editor: `Editor` 当前editor实例

当编辑器内容变化以后触发,无论是输入还是通过api修改都会触发

### focus
- payload:
  - event: `FocusEvent` 
  - editor: `Editor` 当前editor实例

编辑器获取焦点以后触发

### input
- payload:
  - event: `{}` 空对象
  - editor: `Editor` 当前editor实例

### blur
- payload:
  - event: `FocusEvent`
  - editor: `Editor` 当前editor实例
### copy
- payload:
  - event: `{text: string}` 复制的文本内容
  - editor: `Editor` 当前editor实例
### paste
- payload:
  - event: `{text: "string", event: ClipboardEvent}`
  - editor: `Editor` 当前editor实例
### selection-change
- payload:
  - Selection: `Selection`
  - Event: `any` 无效内容

选中文本时触发,两个payload貌似都没啥用。
准确说，用鼠标点击编辑区都会触发这个事件
### cursor-change
- payload:
  - Selection: `Selection`
  - Event: `any` 无效内容
  
光标移动时触发。
### scroll
- payload:
  - scrollHeight: `numebr` 滚动高度
  - EditorSession: `EditorSession`
  - Editor: `Editor` 


### handle-options
未使用