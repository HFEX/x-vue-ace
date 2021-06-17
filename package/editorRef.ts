// eslint-disable-next-line simple-import-sort/imports
import ace from "brace";
import "brace/theme/chrome";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import "brace/mode/python";

import type { Editor } from "brace";
import debounce from "lodash/debounce";
import { computed, onMounted, onUnmounted, Ref, toRef, watch } from "vue";

import { editorOptions } from "./editor-options";
import type { Plugins } from "./pluginsRef";
import { Props } from "./types/props";

declare namespace editorRef {
  export interface params {
    getValue: (notJudge?: boolean) => string;
    isVaryCurrValue: Ref<boolean>;
    currValue: Ref<string>;
    isReadOnly: Ref<boolean>;
    parseMarkup: () => void;
    removeMarkup: () => void;
    formatCode: () => void;
  }
}
/**
 * 创建编辑器实例
 * @param el 用于挂载的dom节点
 * @param editorValue 编辑器初始值
 * @param props 组件props
 * @returns
 */
export default function getEditorRef(
  el: Ref<HTMLElement | undefined>,
  editorValue: Ref<string>,
  selectedText: Ref<string>,
  silent: Ref<boolean>,
  emit: (
    evt: "beforeLoad" | "change" | "focus" | "blur" | "copy" | "paste" | "input",
    ...args: any[]
  ) => void,
  sid: Ref<string>,
  props: Props
) {
  const editor = {} as unknown as { value: Editor };
  const copyrightText = computed(() => {
    return `\n小猴编程（${sid.value}）`;
  });
  function handleCopy(event: ClipboardEvent) {
    if (!props.preventPasteOther) return;
    event.clipboardData?.setData(
      "text/plain",
      `${editor.value.getCopyText()}${copyrightText.value}`
    );
    event.preventDefault();
  }
  function handleCut(event: ClipboardEvent) {
    if (!props.preventPasteOther) return;
    event.clipboardData?.setData("text/plain", `${selectedText.value}${copyrightText.value}`);
    event.preventDefault();
  }
  function handleChange(event: any) {
    if (!silent.value) {
      emit("change", getEditorValue(), event, editor.value);
    }
  }
  onMounted(() => {
    editor.value = ace.edit(el.value as HTMLElement);
    emit("beforeLoad", ace);
    editor.value.$blockScrolling = Infinity;
    const editorProps = Object.keys(props.editorProps);
    for (let i = 0; i < editorProps.length; i += 1) {
      // @ts-ignore
      editor.value[editorProps[i]] = editorProps[editorProps[i]];
    }
    editor.value.renderer.setScrollMargin(
      // @ts-ignore
      ...props.scrollMargin
    );
    watch(
      toRef(props, "mode"),
      (newVal) => {
        editor.value.getSession().setMode(`ace/mode/${newVal}`);
      },
      { immediate: true }
    );
    watch(
      toRef(props, "theme"),
      (newVal) => {
        if (newVal) editor.value.setTheme(`ace/theme/${newVal}`);
      },
      { immediate: true }
    );
    watch(
      toRef(props, "fontSize"),
      (fontSize) => {
        editor.value.setFontSize(fontSize as string);
      },
      { immediate: true }
    );
    editor.value
      .getSession()
      // @ts-ignore
      .setValue(editorValue.value, props.cursorStart);
    if (props.focus) {
      editor.value.focus();
    }
  });
  onUnmounted(() => {
    editor.value.destroy();
  });
  /**
   * 获取编辑器的值，如果编辑器为空，返回内存中的值
   * @returns string
   */
  function getEditorValue() {
    return editor.value ? editor.value.getValue() : editorValue.value;
  }
  function watchEditorValue(
    {
      getValue,
      isVaryCurrValue,
      currValue,
      isReadOnly,
      removeMarkup,
      parseMarkup,
      formatCode,
    }: editorRef.params,
    { plugins, clearPlugins }: Plugins
  ) {
    onMounted(() => {
      // @ts-ignore
      const availableOptions = editor.value.$options;
      for (let i = 0; i < editorOptions.length; i += 1) {
        const option = editorOptions[i];
        if (Object.prototype.hasOwnProperty.call(availableOptions, option)) {
          watch(
            toRef(props, option),
            (newVal) => {
              if (newVal !== null && newVal !== undefined) {
                editor.value.setOption(option, newVal);
              }
            },
            { immediate: true }
          );
        } else if (props[option]) {
          /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
          console.warn(
            `ace: editor option ${option} was activated but not found. Did you need to import a related tool or did you possibly mispell the option?`
          );
        }
      }
      const setOptions = Object.keys(props.setOptions);
      for (let y = 0; y < setOptions.length; y += 1) {
        editor.value.setOption(setOptions[y], props.setOptions[setOptions[y]]);
      }

      formatCode();
      if (props.navigateToFileEnd) {
        editor.value.navigateFileEnd();
      }
      watch(isReadOnly, (newValue) => {
        editor.value.setReadOnly(newValue);
      });
      watch(
        toRef(props, "showGutter"),
        () => {
          editor.value.renderer.setShowGutter(props.showGutter);
        },
        { immediate: true }
      );
      watch(
        toRef(props, "wrapEnabled"),
        () => {
          editor.value.getSession().setUseWrapMode(props.wrapEnabled);
        },
        { immediate: true }
      );
      editor.value.getSession().setUseSoftTabs(false); // 禁空格转为tab
      watch(
        toRef(props, "showPrintMargin"),
        () => {
          editor.value.setShowPrintMargin(props.showPrintMargin);
        },
        { immediate: true }
      );
      editor.value.on("focus", (...args) => emit("focus", ...args, editor.value));
      editor.value.on("blur", (...args) => emit("blur", ...args, editor.value));
      editor.value.on("copy", (...args) => emit("copy", ...args, editor.value));
      editor.value.on("paste", (event) => {
        const reg = /\n小猴编程（(\d+)）/g;
        let { text } = event;
        if (reg.test(event.text)) {
          if (RegExp.$1 === sid.value) {
            text = event.text.replace(reg, "");
          } else {
            text = "";
          }
          // eslint-disable-next-line no-param-reassign
          event.text = text;
        }
        emit("paste", event, editor.value);
      });

      el.value?.addEventListener("copy", handleCopy);
      el.value?.addEventListener("cut", handleCut);

      if (props.debounceChangePeriod) {
        editor.value.on("change", debounce(handleChange, props.debounceChangePeriod));
      } else {
        editor.value.on("change", handleChange);
      }
      editor.value.on("input", (...args) => {
        emit("input", ...args, editor.value);
        if (props.placeholder) updatePlaceholder(editor.value, props.placeholder);
      });

      if (props.placeholder) {
        updatePlaceholder(editor.value, props.placeholder);
      }

      watch(toRef(props, "placeholder"), () => {
        updatePlaceholder(editor.value, props.placeholder);
      });
      watch(toRef(props, "keyboardHandler"), (newVal) => {
        const keyboardHandler = newVal ? `ace/keyboard/${newVal}` : null;
        // @ts-ignore
        editor.value.setKeyboardHandler(keyboardHandler);
      });
      watch(toRef(props, "value"), (newVal) => {
        if (getValue() !== newVal) {
          silent.value = true;
          isVaryCurrValue.value = true;

          editorValue.value = newVal;
          if (currValue.value !== newVal) {
            clearPlugins();
            isReadOnly.value = false;
            // editor.value.setReadOnly(isReadOnly.value);
            if (props.markup) {
              parseMarkup();
            } else if (props.removeMark) {
              removeMarkup();
            }
          }
          // @ts-ignore
          const pos = editor.value.session.selection.toJSON();
          editor.value.setValue(editorValue.value, props.cursorStart);
          // @ts-ignore
          editor.value.session.selection.fromJSON(pos);

          if (currValue.value !== newVal && props.markup) {
            formatCode();
          }

          silent.value = false;
        }
      });
      watch(
        toRef(props, "markup"),
        (newVal) => {
          if (newVal) {
            clearPlugins();
            editorValue.value = getEditorValue();
            parseMarkup();
            editor.value.setValue(editorValue.value, props.cursorStart);
            setTimeout(() => {
              formatCode();
            });
          } else {
            editor.value.setValue(getValue(true), props.cursorStart);
            clearPlugins();
            setTimeout(() => {
              isReadOnly.value = false;
              // editor.value.setReadOnly(isReadOnly.value);
            }, 0);
          }
        }
      );
      watch(toRef(props, "removeMark"), (newVal) => {
        // if (this.getValue() !== newVal) {
        silent.value = true;
        isVaryCurrValue.value = true;

        editorValue.value = props.value;
        // if (this.currValue !== newVal) {
        clearPlugins();
        isReadOnly.value = false;
        // editor.value.setReadOnly(isReadOnly.value);
        if (props.markup && !newVal) {
          parseMarkup();
        } else if (newVal) {
          removeMarkup();
        }
        // @ts-ignore
        const pos = editor.value.session.selection.toJSON();
        editor.value.setValue(editorValue.value, props.cursorStart);
        // @ts-ignore
        editor.value.session.selection.fromJSON(pos);

        if (!newVal && props.markup) {
          formatCode();
        }

        silent.value = false;
      });
    });
    onUnmounted(() => {
      el.value?.removeEventListener("copy", handleCopy);
      el.value?.removeEventListener("cut", handleCut);
    });
  }
  return {
    editor,
    /**
     * 获取编辑器的值，如果编辑器为空，返回内存中的值
     * @returns string
     */
    getEditorValue, //获取编辑器的值
    watchEditorValue,
  };
}
export function removeMarkup(editorValue: Ref<string>) {
  editorValue.value = editorValue.value.replace(/<\/?xiaohou-\w*>/gim, "").trim();
}

function updatePlaceholder(editor: ace.Editor, placeholder: string) {
  const showPlaceholder = !editor.session.getValue().length;
  // @ts-ignore
  let node = editor.renderer.placeholderNode;
  if (!showPlaceholder && node) {
    // @ts-ignore
    editor.renderer.scroller.removeChild(editor.renderer.placeholderNode);
    // @ts-ignore
    editor.renderer.placeholderNode = null;
  } else if (showPlaceholder && !node) {
    // @ts-ignore
    node = document.createElement("div");
    // @ts-ignore
    editor.renderer.placeholderNode = node;
    node.textContent = placeholder || "";
    node.className = "ace_comment ace_placeholder";
    node.style.padding = "0 9px";
    node.style.position = "absolute";
    node.style.zIndex = "3";
    editor.renderer.scroller.appendChild(node);
  } else if (showPlaceholder && node) {
    node.textContent = placeholder;
  }
}
