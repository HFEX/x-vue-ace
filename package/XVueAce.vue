<template>
  <div
    ref="refEditor"
    class="element-editor"
  />
</template>

<script>
import * as ace from 'brace';
import {
  editorOptions,
  debounce,
} from './editor-options';

const { Range } = ace.acequire('ace/range');

export default {
  props: {
    mode: {
      type: String,
      default: '',
    },
    focus: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '600px',
    },
    height: {
      type: String,
      default: '500px',
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
      default: '',
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
      default() {
        return {};
      },
    },
    setOptions: {
      type: Object,
      default() {
        return {};
      },
    },
    scrollMargin: {
      type: Array,
      default() {
        return [0, 0, 0, 0];
      },
    },
    annotations: {
      type: Array,
    },
    markers: {
      type: Array,
    },
    keyboardHandler: {
      type: String,
    },
    wrapEnabled: {
      type: Boolean,
      default: false,
    },
    enableBasicAutocompletion: {
      type: [Array, Boolean],
      default: false,
    },
    enableLiveAutocompletion: {
      type: [Array, Boolean],
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
      default: '',
    },
    enableMarkup: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      originCode: '',
      code: '',
      headCode: '',
      tailCode: '',
      complete: '',
    };
  },

  mounted() {
    this.originCode = this.value;
    this.code = this.value;

    if (this.enableMarkup) {
      const [fragment0, fragment1] = this.originCode.match(/<xiaohou-hide>([^]+?)\<\/xiaohou-hide>/gm) || [];
      if (fragment0 && fragment1) {
        this.headCode = fragment0;
        this.tailCode = fragment1;
      } else if (fragment0 && this.originCode.indexOf(fragment0) === 0 && !fragment1) {
        this.headCode = fragment0;
      } else if (fragment0 && this.originCode.indexOf(fragment0) != 0 && !fragment1) {
        this.tailCode = fragment0;
      }
      
      this.code = this.code.replace(this.headCode, '');
      this.code = this.code.replace(this.tailCode, '');
    };

    this.editor = ace.edit(this.$refs.refEditor);

    this.$emit('before-load', ace);

    this.editor.$blockScrolling = Infinity;

    const editorProps = Object.keys(this.editorProps);
    for (let i = 0; i < editorProps.length; i += 1) {
      this.editor[editorProps[i]] = this.editorProps[editorProps[i]];
    }
    this.editor.renderer.setScrollMargin(
      ...this.scrollMargin,
    );
    this.editor.getSession().setMode(`ace/mode/${this.mode}`);
    if (this.theme) this.editor.setTheme(`ace/theme/${this.theme}`);
    this.editor.setFontSize(this.fontSize);
    this.editor
      .getSession()
      .setValue(this.code, this.cursorStart);
    if (this.navigateToFileEnd) {
      this.editor.navigateFileEnd();
    }
    this.editor.renderer.setShowGutter(this.showGutter);
    this.editor.getSession().setUseWrapMode(this.wrapEnabled);
    this.editor.setShowPrintMargin(this.showPrintMargin);
    // const events = ['focus', 'blur', 'copy', 'paste', 'change', 'input'];
    this.editor.on('focus', (...args) => this.$emit('focus', ...args, this.editor));
    this.editor.on('blur', (...args) => this.$emit('blur', ...args, this.editor));
    this.editor.on('copy', (...args) => this.$emit('copy', ...args, this.editor));
    this.editor.on('paste', (...args) => this.$emit('paste', ...args, this.editor));

    if (this.debounceChangePeriod) {
      this.editor.on('change', debounce(this.handleChange.bind(this), this.debounceChangePeriod));
    } else {
      this.editor.on('change', this.handleChange.bind(this));
    }
    this.editor.on('input', (...args) => {
      this.$emit('input', ...args, this.editor);
      if (this.placeholder) this.updatePlaceholder();
    });

    if (this.placeholder) {
      this.updatePlaceholder(this.editor, this.placeholder);
    }

    this.editor
      .getSession()
      .selection.on('changeSelection', this.handleSelectionChange);
    this.editor
      .getSession()
      .selection.on('changeCursor', this.handleCursorChange);
    this.editor
      .getSession()
      .on('changeAnnotation', this.handleValidate);
    this.editor
      .session
      .on('changeScrollTop', (...args) => this.$emit('scroll', ...args, this.editor));
    this.editor
      .getSession()
      .setAnnotations(this.annotations || []);
    if (this.markers && this.markers.length > 0) {
      this.handleMarkers(this.markers);
    }

    const availableOptions = this.editor.$options;
    for (let i = 0; i < editorOptions.length; i += 1) {
      const option = editorOptions[i];
      if (Object.prototype.hasOwnProperty.call(availableOptions, option)) {
        this.editor.setOption(option, this[option]);
      } else if (this[option]) {
        /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
        console.warn(
          `ace: editor option ${option} was activated but not found. Did you need to import a related tool or did you possibly mispell the option?`,
        );
      }
    }
    this.handleOptions(this.$props || {});

    if (Array.isArray(this.commands)) {
      this.commands.forEach((command) => {
        if (typeof command.exec === 'string') {
          this.editor.commands.bindKey(command.bindKey, command.exec);
        } else {
          this.editor.commands.addCommand(command);
        }
      });
    }

    if (this.keyboardHandler) {
      this.editor.setKeyboardHandler(`ace/keyboard/${this.keyboardHandler}`);
    }

    this.$emit('load', this.editor);

    this.editor.resize();
    this.resize = debounce(this.editor.resize.bind(this.editor), 100, true);

    if (this.focus) {
      this.editor.focus();
    }

    // watch
    for (let i = 0, len = editorOptions.length; i < len; i += 1) {
      const option = editorOptions[i];
      this.$watch(option, (newVal) => {
        this.editor.setOption(option, newVal);
      });
    }

    this.$watch('code', (newVal) => {
      if (this.editor.getValue() !== newVal) {
        this.silent = true;
        const pos = this.editor.session.selection.toJSON();
        this.editor.setValue(newVal, this.cursorStart);
        this.editor.session.selection.fromJSON(pos);
        this.silent = false;
      }
    });

    this.$watch('placeholder', () => this.updatePlaceholder());

    this.$watch('mode', (newVal) => {
      this.editor.getSession().setMode(`ace/mode/${newVal}`);
    });

    this.$watch('theme', (newVal) => {
      this.editor.setTheme(`ace/theme/${newVal}`);
    });

    this.$watch('keyboardHandler', (newVal) => {
      const keyboardHandler = newVal
        ? `ace/keyboard/${newVal}`
        : null;

      this.editor.setKeyboardHandler(keyboardHandler);
    });

    this.$watch('fontSize', (newVal) => {
      this.editor.setFontSize(newVal);
    });

    this.$watch('wrapEnabled', (newVal) => {
      this.editor.getSession().setUseWrapMode(newVal);
    });

    this.$watch('showPrintMargin', (newVal) => {
      this.editor.setShowPrintMargin(newVal);
    });

    this.$watch('showGutter', (newVal) => {
      this.editor.renderer.setShowGutter(newVal);
    });

    this.$watch('annotations', (annotations) => {
      this.editor.getSession().setAnnotations(annotations || []);
    });

    this.$watch('markers', (markers) => {
      this.handleMarkers(markers);
    });

    this.$watch('height', () => this.editor.resize());
    this.$watch('width', () => this.editor.resize());
    this.$watch('focus', () => this.editor.focus());
  },

  methods: {
    insert(text, focus = true) {
      this.editor.insert(text);
      if (focus) this.editor.focus();
    },

    insertAndSelect(text, pos = '', focus = true) {
      if (pos) {
        const posArr = pos
          .split(/,|，/)
          .map(v => parseInt(v, 10));

        const { start } = this.editor.getSelection().getRange();
        this.insert(text, focus);
        this.select(
          start.row + (posArr[0] - 1 || 0),
          posArr[0] > 1 ? (posArr[1] || 0) : start.column + (posArr[1] || 0),
          posArr[2],
          focus,
        );
        return;
      }

      this.insert(text, focus);
    },

    select(
      row,
      col,
      length,
      focus = true,
    ) {
      this.editor.navigateTo(row, col);
      if (length) this.editor.getSelection().selectTo(row, col + length);
      if (focus) this.editor.focus();
    },

    handleChange(event) {
      if (!this.silent) {
        let value = this.editor.getValue();

        if (this.enableMarkup) {
          value = `${this.headCode}${value}${this.tailCode}`;
        }

        this.$emit('change', value, event, this.editor);
      }
    },

    handleScrollMargins(margins = [0, 0, 0, 0]) {
      this.editor.renderer.setScrollMargins(
        margins[0],
        margins[1],
        margins[2],
        margins[3],
      );
    },

    handleSelectionChange(event) {
      const value = this.editor.getSelection();
      this.$emit('selection-change', value, event);
    },

    handleCursorChange(event) {
      const value = this.editor.getSelection();
      this.$emit('cursor-change', value, event);
    },

    handleValidate() {
      const annotations = this.editor.getSession().getAnnotations();
      this.$emit('validate', annotations);
    },

    handleOptions(props) {
      const setOptions = Object.keys(props.setOptions);
      for (let y = 0; y < setOptions.length; y += 1) {
        this.editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);
      }
    },

    handleMarkers(markers) {
      // remove foreground markers
      let currentMarkers = this.editor.getSession().getMarkers(true);
      Object.keys(currentMarkers)
        .forEach((i) => {
          this.editor.getSession().removeMarker(currentMarkers[i].id);
        });

      currentMarkers = this.editor.getSession().getMarkers(false);
      Object.keys(currentMarkers)
        .forEach((i) => {
          if (
            currentMarkers[i].clazz !== 'ace_active-line'
            && currentMarkers[i].clazz !== 'ace_selected-word'
          ) {
            this.editor.getSession().removeMarker(currentMarkers[i].id);
          }
        });

      markers.forEach(
        ({
          startRow,
          startCol,
          endRow,
          endCol,
          className,
          type,
          inFront = false,
        }) => {
          const range = new Range(startRow, startCol, endRow, endCol);
          this.editor.getSession().addMarker(range, className, type, inFront);
        },
      );
    },

    updatePlaceholder() {
      const { editor } = this;
      const { placeholder } = this;

      const showPlaceholder = !editor.session.getValue().length;
      let node = editor.renderer.placeholderNode;
      if (!showPlaceholder && node) {
        editor.renderer.scroller.removeChild(editor.renderer.placeholderNode);
        editor.renderer.placeholderNode = null;
      } else if (showPlaceholder && !node) {
        node = document.createElement('div');
        editor.renderer.placeholderNode = node;
        node.textContent = placeholder || '';
        node.className = 'ace_comment ace_placeholder';
        node.style.padding = '0 9px';
        node.style.position = 'absolute';
        node.style.zIndex = '3';
        editor.renderer.scroller.appendChild(node);
      } else if (showPlaceholder && node) {
        node.textContent = placeholder;
      }
    },

    resize() {
      this.editor.resize();
    },
  },

  destroyed() {
    this.editor.destroy();
    this.editor = null;
  },
};
</script>
<style lang="less">
.element-editor {
  background-color: white;
}

.ace {
  &-tm .ace_gutter {
    background-color: white;
  }

  &_gutter-cell {
    color: #cfcfcf;
  }

  &_invisible {
    opacity: 0
  }

  &_gutter-layer,
  &_print-margin {
    background-color: white
  }

  &_line.highlighted {
    background-color: #fabd2f
  }

  &_line.highlighted.bright {
    background-color: #fae8c3
  }

  &_content.blink {
    background-color: rgba(251,203,87,0.64)
  }
}
</style>
