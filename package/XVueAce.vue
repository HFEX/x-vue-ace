<template>
  <div>
    <div
      class="element-blank"
      v-show="enableMarkup && isBlankReady"
    >
      <input
        class="blankInputs"
        v-for="(item, index) in blanks"
        :key="'blank' + index"
        :id="'blank' + index"
        :value="item"
        @input="blankChange($event, index)"
      />
    </div>
    <div
      ref="refEditor"
      class="element-editor"
    />
  </div>
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
      default: true,
    },
  },

  data() {
    return {
      code: '',
      headCode: '',
      tailCode: '',
      blanks: [],
      blankRanges: [],
      isBlankReady: false,
      preserved: [],
      preservedRanges: [],
      preservedAnchors: [],
      isPreservedReady: false,
      isReadOnly: false,
    };
  },

  mounted() {
    this.code = this.value;

    this.handleMarkup();

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

      if (this.blanks.length > 0) {
        this.blankRender();
      }
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

    this.$watch('enableMarkup', (newVal) => {
      if (newVal) {
        this.handleMarkup();
        this.editor.setValue(this.code, this.cursorStart);
        setTimeout(() => {
          this.handleBlankOrPreserved();
        });
      } else {
        this.isReadOnly = false;
        this.editor.setReadOnly(this.isReadOnly);

        let markers;
        if (this.blanks.length > 0) {
          markers = this.editor.getSession().getMarkers(true);
          Object.keys(markers).forEach((id) => {
            if (markers[id].clazz === 'blank-highlight') {
              this.editor.getSession().removeMarker(id);
            }
          });
        } else if (this.preserved.length > 0) {
          markers = this.editor.getSession().getMarkers();
          Object.keys(markers).forEach((id) => {
            if (markers[id].clazz === 'readonly-highlight') {
              this.editor.getSession().removeMarker(id);
            }
          });
        }

        this.code = this.syncGetCode(true);
        this.editor.setValue(this.code, this.cursorStart);
      }
    });

    this.handleBlankOrPreserved();
  },

  methods: {
    // public methods
    getCode() {
      return this.syncGetCode().replace(/<\/?xiaohou-(hide|lock|blank)>/ig, '');
    },

    // private methods
    handleMarkup() {
      const originCode = this.code;
      if (this.enableMarkup) {
        // code hide
        const [fragment0, fragment1] = originCode.match(/<xiaohou-hide>([^]+?)<\/xiaohou-hide>/igm) || [];
        if (fragment0 && fragment1) {
          this.headCode = fragment0;
          this.tailCode = fragment1;
        } else if (fragment0 && originCode.indexOf(fragment0) === 0 && !fragment1) {
          this.headCode = fragment0;
        } else if (fragment0 && originCode.indexOf(fragment0) !== 0 && !fragment1) {
          this.tailCode = fragment0;
        }

        this.code = this.code.replace(this.headCode, '');
        this.code = this.code.replace(this.tailCode, '');

        // code lock or code blank
        if (this.code.indexOf('<xiaohou-blank>') > -1) {
          this.blanks = originCode.match(/<xiaohou-blank>([^]*?)<\/xiaohou-blank>/igm) || [];

          this.blanks = this.blanks.map((item) => {
            this.code = this.code.replace(item, '<xhc_blank/>');
            return item.replace(/<\/?xiaohou-blank>/ig, '');
          });
        } else if (this.code.indexOf('<xiaohou-lock>') > -1) {
          this.preserved = originCode.match(/<xiaohou-lock>([^]*?)<\/xiaohou-lock>/igm) || [];
        }
      }
    },
    handleBlankOrPreserved() {
      if (this.blanks.length > 0) {
        this.isReadOnly = true;
        this.editor.setReadOnly(this.isReadOnly);
        for (let i = 0, len = this.blanks.length; i < len; i += 1) {
          const range = this.editor.find('<xhc_blank/>');
          this.editor.session.addMarker(range, 'blank-highlight', null, true);
          this.blankRanges.push(range);
        }
        this.editor.gotoLine(0);

        setTimeout(() => {
          this.isBlankReady = true;
          this.blankRender();
        }, 1000);
      }

      if (this.preserved.length > 0) {
        this.preservedRanges = this.preserved.map(item => this.editor.find(item));
        this.preservedAnchors = this.preservedRanges.map((item, index) => {
          let range;
          if (item.start.row === item.end.row) {
            range = new Range(
              item.start.row,
              item.start.column,
              item.end.row,
              item.end.column - 29,
            );
          } else {
            range = new Range(
              item.start.row,
              item.start.column,
              item.end.row,
              item.end.column - 15,
            );
          }
          this.editor.session.addMarker(range, 'readonly-highlight');
          this.editor.session.replace(
            new Range(
              item.start.row,
              item.start.column,
              item.end.row,
              item.end.column,
            ),
            this.preserved[index].replace(/<\/?xiaohou-lock>/ig, ''),
          );

          range.start = this.editor.session.doc.createAnchor(range.start);
          range.end = this.editor.session.doc.createAnchor(range.end);
          range.end.$insertRight = true;
          return range;
        });
        this.editor.gotoLine(0);
        this.isPreservedReady = true;

        // 出现部分只读 => 要禁用选取
        this.editor.getSession().selection.on('changeCursor', () => {
          // anchor更新是异步执行
          setTimeout(() => {
            const selection = this.editor.getSession().selection.getRange();
            if (this.preservedAnchors.some((anchor) => {
              if (
                // 1.仅只读范围起点在选取范围中
                ((anchor.start.row > selection.start.row
                && anchor.start.row < selection.end.row)
                || (anchor.start.row === selection.start.row
                && anchor.start.column >= selection.start.column
                && anchor.start.row === selection.end.row
                && anchor.start.column <= selection.end.column)
                || (anchor.start.row === selection.start.row
                && anchor.start.column >= selection.start.column
                && anchor.start.row < selection.end.row)
                || (anchor.start.row > selection.start.row
                && anchor.start.row === selection.end.row
                && anchor.start.column <= selection.end.column))
                // 2.仅只读范围终点在选取范围中
                || ((anchor.end.row > selection.start.row
                && anchor.end.row < selection.end.row)
                || (anchor.end.row === selection.start.row
                && anchor.end.column >= selection.start.column
                && anchor.end.row === selection.end.row
                && anchor.end.column <= selection.end.column)
                || (anchor.end.row === selection.start.row
                && anchor.end.column >= selection.start.column
                && anchor.end.row < selection.end.row)
                || (anchor.end.row > selection.start.row
                && anchor.end.row === selection.end.row
                && anchor.end.column <= selection.end.column))
                // 3.只读范围涵盖选取范围
                // 3.1.起止不在同一行
                || (anchor.start.row < selection.start.row
                && anchor.end.row > selection.end.row)
                // 3.2.起在同一行 止可能在同一行
                || (anchor.start.row === selection.start.row
                && anchor.start.column <= selection.start.column
                && (anchor.end.row > selection.end.row
                || (anchor.end.row === selection.end.row
                && anchor.end.column >= selection.end.column)))
                // 3.3 止在同一行 起可能在同一行
                || (anchor.end.row === selection.end.row
                && anchor.end.column >= selection.end.column
                && (anchor.start.row > selection.start.row
                || (anchor.start.row === selection.start.row
                && anchor.start.column <= selection.start.column)))
              ) {
                return true;
              }
              return false;
            })) {
              this.isReadOnly = true;
            } else {
              this.isReadOnly = false;
            }
            this.editor.setReadOnly(this.isReadOnly);
          }, 0);
        });
      }
    },
    syncGetCode(notJudge) {
      let value = this.editor.getValue();

      if (this.enableMarkup || notJudge) {
        if (this.blanks.length > 0) {
          value = this.spliceBlanks(value);
        } else if (this.preserved.length > 0) {
          value = this.splicePreserveds();
        } else {
          value = `${this.headCode}${value}${this.tailCode}`;
        }
      }

      return value;
    },
    asyncGetCode() {
      let value = this.editor.getValue();

      if (this.enableMarkup) {
        if (this.blanks.length > 0) {
          value = this.spliceBlanks(value);
        } else if (this.preserved.length > 0) {
          // 编辑器回车是异步执行
          return new Promise((resolve) => {
            setTimeout(() => resolve(this.splicePreserveds()), 0);
          });
        } else {
          value = `${this.headCode}${value}${this.tailCode}`;
        }
      }

      return Promise.resolve(value);
    },
    spliceBlanks(value) {
      this.blanks.forEach((item, index) => {
        /* eslint-disable-next-line no-param-reassign */
        value = value.replace(
          '<xhc_blank/>',
          `<xiaohou-blank>${this.blanks[index]}</xiaohou-blank>`,
        );
      });
      return `${this.headCode}${value}${this.tailCode}`;
    },
    splicePreserveds() {
      let showCode = '';
      const start = {
        row: 0,
        column: 0,
      };
      for (let i = 0, len = this.preservedAnchors.length; i < len; i += 1) {
        showCode += this.editor.getSession().doc.getTextRange(
          new Range(
            start.row,
            start.column,
            this.preservedAnchors[i].start.row,
            this.preservedAnchors[i].start.column,
          ),
        );
        showCode += this.preserved[i];
        start.row = this.preservedAnchors[i].end.row;
        start.column = this.preservedAnchors[i].end.column;
        if (i === len - 1) {
          const lastRow = this.editor.getSession().getLength() - 1;
          const lastColumn = this.editor.getSession().getLine(lastRow).length;

          showCode += this.editor.getSession().doc.getTextRange(
            new Range(
              start.row,
              start.column,
              lastRow,
              lastColumn,
            ),
          );
        }
      }

      return `${this.headCode}${showCode}${this.tailCode}`;
    },
    blankRender() {
      const blankDoms = this.$refs.refEditor.getElementsByClassName('blank-highlight');
      const blankArray = [...blankDoms];
      blankArray.forEach((item, index) => {
        const {
          top,
          left,
          width,
          height,
        } = item.getBoundingClientRect();
        window.requestAnimationFrame(() => {
          document.getElementById(`blank${index}`).style.top = `${top}px`;
          document.getElementById(`blank${index}`).style.left = `${left}px`;
          document.getElementById(`blank${index}`).style.width = `${width}px`;
          document.getElementById(`blank${index}`).style.height = `${height - 6}px`;
          document.getElementById(`blank${index}`).style.fontSize = `${this.fontSize}px`;
        });
      });
    },
    blankChange(evt, index) {
      this.blanks[index] = evt.target.value;

      this.handleChange();
    },

    insert(text, focus = true) {
      if (this.isReadOnly || this.readOnly) {
        return;
      }

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
        this.asyncGetCode().then((value) => {
          this.$emit('change', value, event, this.editor);
        });
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
.element-blank {
  position: absolute;
  z-index: 9;
  .blankInputs {
    position: absolute;
    outline: none;
    border: 2px solid #333;
  }
}
.element-editor {
  width: 100%;
  height: 100%;
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

.readonly-highlight {
  background-color: #333;
  opacity: 0.2;
  position: absolute;
}
.blank-highlight {
  background-color: #fff;
  position: absolute;
}
</style>
