# Welcome to x-vue-ace
# 介绍

> Ace是一个用JavaScript编写的可嵌入代码编辑器。它与Sublime，Vim和TextMate等本机编辑器的功能和性能相匹配。它可以轻松地嵌入任何网页和JavaScript应用程序中。

- 官网地址：[Ace - The High Performance Code Editor for the Web](https://ace.c9.io/ "Ace - The High Performance Code Editor for the Web")

- Github: [GitHub - ajaxorg/ace: Ace (Ajax.org Cloud9 Editor)](https://github.com/ajaxorg/ace/ "GitHub - ajaxorg/ace: Ace (Ajax.org Cloud9 Editor)")

# 在项目中配置Ace

```javascript

// 将代码模式配置到ace选项

ace.edit(element, {

  mode: "ace/mode/javascript",

  selectionStyle: "text"

})

// 使用setOptions方法一次设置多个选项

editor.setOptions({

  autoScrollEditorIntoView: true,

  copyWithEmptySelection: true,

});

// 单独设置setOptions方法

editor.setOption("mergeUndoDeltas", "always");

// 一些选项也直接设置，例如：

editor.setTheme(...)

// 获取选项设置值

editor.getOption("optionName");

// 核心Ace组件包括（editor, session, renderer, mouseHandler）

setOption(optionName, optionValue)

setOptions({

  optionName : optionValue

})

getOption(optionName)

getOptions()

```

# API选项

> 以下是目前所有支持的选项的列表。除非另有说明，否则选项值皆为布尔值，可以通过editor.setOption来设置。

#### - editor选项

| 选项名 | 值类型 | 默认值 | 可选值 | 备注 |
| -|-|-|-|-|
selectionStyle | String | text | line&#124;text | 选中样式 |
highlightActiveLine | Boolean | true | - | 高亮当前行 |
highlightSelectedWord | Boolean | true | - | 高亮选中文本 |
readOnly | Boolean | false | - | 是否只读 |
cursorStyle | String | ace | ace&#124;slim&#124;smooth&#124;wide | 光标样式 |
mergeUndoDeltas | String&#124;Boolean | false | always | 合并撤销 |
behavioursEnabled | Boolean | true | - | 启用行为 |
wrapBehavioursEnabled | Boolean | true | - | 启用换行 |
autoScrollEditorIntoView | Boolean | false | - | 启用滚动 |
copyWithEmptySelection | Boolean | true | - | 复制空格 |
useSoftTabs | Boolean | false | - | 使用软标签 |
navigateWithinSoftTabs | Boolean | false | - | 软标签跳转 |
enableMultiselect | Boolean | false | - | 选中多处 |

#### - renderer选项

| 选项名 | 值类型 | 默认值 | 可选值 | 备注 |
| - | - | - | - | - |
| hScrollBarAlwaysVisible | Boolean | false | - | 纵向滚动条始终可见 |
| vScrollBarAlwaysVisible | Boolean | false | - | 横向滚动条始终可见 |
| highlightGutterLine | Boolean | true | - | 高亮边线 |
| animatedScroll | Boolean | false | - | 滚动动画 |
| showInvisibles | Boolean | false | - | 显示不可见字符 |
| showPrintMargin | Boolean | false | - | 显示打印边距 |
| printMarginColumn | Number | 80 | - | 设置页边距 |
| printMargin | Boolean&#124;Number | false | - | 显示并设置页边距 |
| fadeFoldWidgets | Boolean | false | - | 淡入折叠部件 |
| showFoldWidgets | Boolean | true | - | 显示折叠部件 |
| showLineNumbers | Boolean | true | - | 显示行号 |
| showGutter | Boolean | true | - | 显示行号区域 |
| displayIndentGuides | Boolean | true | - | 显示参考线 |
| fontSize | Number&#124;String | inherit | - | 设置字号 |
| fontFamily | String | inherit | | 设置字体 |
| maxLines | Number | - | - | 至多行数 |
| minLines | Number | - | - | 至少行数 |
| scrollPastEnd | Boolean&#124;Number | 0 | - | 滚动位置 |
| fixedWidthGutter | Boolean | false | - | 固定行号区域宽度 |
| theme | String | - | - | 主题引用路径，例如"ace/theme/textmate" |

#### - mouseHandler选项

| 选项名 | 值类型 | 默认值 | 可选值 | 备注 |
| - | - | - | - | - |
| scrollSpeed | Number | - | - | 滚动速度 |
| dragDelay | Number | - | - | 拖拽延时 |
| dragEnabled | Boolean | true | - | 是否启用拖动 |
| focusTimout | Number | - | - | 聚焦超时 |
| tooltipFollowsMouse | Boolean | false | - | 鼠标提示 |

#### - session选项

| 选项名 | 值类型 | 默认值 | 可选值 | 备注 |
| - | - | - | - | - |
| firstLineNumber | Number | 1 | - | 起始行号 |
| overwrite | Boolean | - | - | 重做 |
| newLineMode | String | auto | auto&#124;unix&#124;windows | 新开行模式 |
| useWorker | Boolean | - | - | 使用辅助对象 |
| useSoftTabs | Boolean | - | - | 使用软标签 |
| tabSize | Number | - | - | 标签大小 |
| wrap | Boolean | - | - | 换行 |
| foldStyle | String | - | markbegin&#124;markbeginend&#124;manual | 折叠样式 |
| mode | String | - | - | 代码匹配模式，例如“ace/mode/text" |

#### - 扩展选项

| 选项名 | 值类型 | 默认值 | 可选值 | 备注 |
| - | - | - | - | - |
| enableBasicAutocompletion | Boolean | - | - | 启用基本自动完成 |
| enableLiveAutocompletion | Boolean | - | - | 启用实时自动完成 |
| enableSnippets | Boolean | - | - | 启用代码段 |
| enableEmmet | Boolean | - | - | 启用Emmet |
| useElasticTabstops | Boolean | - | - | 使用弹性制表位 |