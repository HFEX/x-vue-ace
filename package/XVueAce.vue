<template>
  <div @keydown.capture="protectBoundary">
    <div ref="refEditor" class="element-editor" />
    <transition name="fade">
      <i v-show="isReadOnly && isShowLock" class="element-lock"></i>
    </transition>
  </div>
</template>

<script lang="ts">
import AceAjax from "brace";
import debounce from "lodash/debounce";
import styleInject from "style-inject";
import { PropType, toRef, watch } from "vue";
import { defineComponent, onMounted, ref } from "vue";

import getEditorRef from "./editorRef";
import getEditorValueRef from "./editorValueRef";
import css from "./index.less";
import { usePluginsRef } from "./pluginsRef";
import getReadOnlyRef from "./readOnlyRef";
import getSidRef from "./sidRef";
import type { marker } from "./types/props";
import getFormatfunction from "./utils/formatCode";
import beforeParse from "./utils/prase";
import watchAnnotations from "./watchAnnotations";
import watchMarkers from "./watchMarkers";
styleInject(css);

export default defineComponent({
  props: {
    mode: {
      type: String,
      default: "",
    },
    focus: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "600px",
    },
    height: {
      type: String,
      default: "500px",
    },
    fontSize: {
      type: [Number, String],
      default: 12,
    },
    showGutter: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: "",
    },
    // defaultValue: PropTypes.string,
    minLines: {
      type: Number,
      default: null,
    },
    maxLines: {
      type: Number,
      default: null,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    markup: {
      type: Boolean,
      default: true,
    },
    removeMark: {
      type: Boolean,
      default: false,
    },
    highlightActiveLine: {
      type: Boolean,
      default: true,
    },
    tabSize: {
      type: Number,
      default: 4,
    },
    showPrintMargin: {
      type: Boolean,
      default: false,
    },
    cursorStart: {
      type: Number,
      default: 1,
    },
    debounceChangePeriod: {
      type: Number,
    },
    editorProps: {
      type: Object,
      default: () => ({}),
    },
    setOptions: {
      type: Object,
      default: () => ({}),
    },
    scrollMargin: {
      type: Array as PropType<number[]>,
      default: () => [0, 0, 0, 0],
    },
    annotations: {
      type: Array as PropType<AceAjax.Annotation[]>,
    },
    markers: {
      type: Array as PropType<marker[]>,
    },
    keyboardHandler: {
      type: String,
    },
    wrapEnabled: {
      type: Boolean,
      default: false,
    },
    enableBasicAutocompletion: {
      type: Boolean,
      default: false,
    },
    enableLiveAutocompletion: {
      type: Boolean,
      default: false,
    },
    navigateToFileEnd: {
      type: Boolean,
      default: false,
    },
    commands: {
      type: Array,
    },
    placeholder: {
      type: String,
      default: "",
    },
    preventPasteOther: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "beforeLoad",
    "change",
    "focus",
    "input",
    "blur",
    "copy",
    "paste",
    "selection-change",
    "cursor-change",
    "scroll",
    "handle-options",
  ],
  setup: (props, { emit }) => {
    const silent = ref(false);
    const selectedText = ref("");
    const { sid } = getSidRef();
    // computed: {
    //   copyrightText() {
    //     return `\n小猴编程（${this.sid}）`;
    //   },
    // },
    // 初始化编辑器
    const refEditor = ref<HTMLElement | undefined>(undefined);
    const { editorValue, getValueFunction, currValue, isVaryCurrValue } = getEditorValueRef(props);
    const { editor, getEditorValue, watchEditorValue } = getEditorRef(
      refEditor,
      editorValue,
      selectedText,
      silent,
      emit,
      sid,
      props
    );
    const { isReadOnly } = getReadOnlyRef(props);
    const plugins = usePluginsRef({
      editor: editor,
      editorValue: editorValue,
      isReadOnly,
    });
    const { isShowLock } = plugins;
    const { getValue } = getValueFunction({
      ...plugins,
      getEditorValue,
    });

    const addMarkup = () => {
      editorValue.value = props.value;
    };
    const removeMarkup = () => {
      editorValue.value = editorValue.value.replace(/<\/?xiaohou-\w*>/gim, "").trim();
    };
    const parseMarkup = () => {
      if (props.markup) {
        // 某些插件在功能上可能是相互冲突的，此处对此做处理
        editorValue.value = beforeParse(editorValue.value);

        // xiaohou-hide
        plugins.parseHide();

        // xiaohou-blank or xiaohou-lock
        plugins.parseLock();
        plugins.parseBlank();
      } else if (props.removeMark) {
        // 过滤掉所有的 xiaohou 标签
        removeMarkup();
      }
    };
    const formatCode = getFormatfunction({ editor, ...plugins });

    function protectBoundary(evt: KeyboardEvent) {
      // 边界保护
      plugins.plugins.value.forEach((plugin) => {
        switch (plugin) {
          case "blank":
            plugins.protectBlankBoundary(evt);
            break;
          case "lock":
            plugins.protectPreservedBoundary(evt);
            break;
          default:
        }
      });

      if (!isReadOnly.value) {
        isVaryCurrValue.value = true;
      }
    }
    watchEditorValue(
      {
        getValue,
        isVaryCurrValue,
        currValue,
        isReadOnly,
        parseMarkup,
        removeMarkup,
        formatCode,
      },
      plugins
    );
    watchMarkers(editor, props);
    watchAnnotations(editor, props);
    onMounted(() => {
      // @ts-ignore
      if (props.preventPasteOther) selectedText.value = editor.value.getSelectedText();
      editor.value.getSession().selection.on("changeSelection", (event: unknown) => {
        const value = editor.value.getSelection();
        if (props.preventPasteOther) {
          // @ts-ignore
          selectedText.value = editor.value.getSelectedText() || selectedText;
        }

        emit("selection-change", value, event);
      });
      editor.value.getSession().selection.on("changeCursor", (event: any) => {
        const value = editor.value.getSelection();
        emit("cursor-change", value, event);
      });
      editor.value.session.on("changeScrollTop", (...args) =>
        emit("scroll", ...args, editor.value)
      );
      editor.value.resize();
    });
    const insertAndSelect = (txt: string, pos = "", focus = true) => {
      const { start } = editor.value.getSelection().getRange();
      const currLine = editor.value.getSession().getDocument().getLine(start.row);
      const m = currLine.match(/^\s*\t*/);

      let text = txt;
      // 如果当前行存在缩进，则在要插入的代码第二行及之后都加上缩进
      if (m) {
        const indent = m[0];
        text = text.replace(/^/gm, (match, p) => {
          if (p > 0) return `${indent}${match}`;
          return match;
        });
      }
      if (pos) {
        const posArr = pos.split(/,|，/).map((v) => parseInt(v, 10));

        insert(text, focus);
        const p1 = posArr[0] - 1 || 0;
        const r = start.row + p1;
        let c = posArr[0] > 1 ? posArr[1] || 0 : (posArr[1] || 0) + start.column;
        // 如果存在缩进&&要选中的是第二行及之后，则加上缩进的位移
        if (m && p1 > 0) {
          c += m[0].length;
        }

        select(r, c, posArr[2], focus);
        return;
      }

      insert(text, focus);
    };
    const insert = (text: string, focus = true) => {
      if (isReadOnly.value || props.readOnly) {
        return;
      }

      editor.value.insert(text);
      isVaryCurrValue.value = true;
      if (focus) editor.value.focus();
    };
    const select = (row: number, col: number, length: number, focus = true) => {
      editor.value.navigateTo(row, col);
      if (length) editor.value.getSelection().selectTo(row, col + length);
      if (focus) editor.value.focus();
    };
    const resize = debounce(() => editor.value.resize(), 100, {
      leading: true,
      trailing: true,
    });
    watch(toRef(props, "height"), () => resize());
    watch(toRef(props, "width"), () => resize());
    return {
      protectBoundary,
      insertAndSelect,
      formatCode,
      addMarkup,
      insert,
      select,
      isReadOnly,
      getValue,
      refEditor,
      editor,
      resize,
      ...plugins,
      isShowLock,
    };
  },
});
</script>
