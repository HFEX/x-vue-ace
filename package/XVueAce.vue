<template>
  <div @keydown.capture="protectBoundary">
    <div
      ref="refEditor"
      class="element-editor"
    />
    <i
      v-if="isReadOnly"
      :class="{
        'element-lock': true,
        'element-lock-flash': isReadOnly && isShowLock,
      }"
    ></i>
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
    markup: {
      type: Boolean,
      default: true,
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
  },

  data() {
    return {
      currValue: '', // 当前全量代码
      editorValue: '', // 文本 编辑器代码
      execValue: '', // 计算代码

      plugins: [], // 插件
      isVaryCurrValue: true, // 是否变更过当前全量代码
      startCode: '', // 开头隐藏代码
      endCode: '', // 结尾隐藏代码
      blanks: [], // 空白处初始内容
      blankGaps: [], // 空白与空白之间内容
      blankAnchors: [], // 空白范围
      preserveds: [], // 只读处初始内容
      preservedAnchors: [], // 只读范围
      isReadOnly: false, // 编辑器是否只读
      isShowLock: false, // 是否展示锁 🔒
    };
  },

  mounted() {
    this.editorValue = this.value;
    this.parseMarkup();

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
      .setValue(this.editorValue, this.cursorStart);

    if (this.plugins.length > 0) {
      for (let idx = this.plugins.length - 1; idx >= 0; idx -= 1) {
        switch (this.plugins[idx]) {
          case 'blank':
            this.affectBlank();
            break;
          case 'lock':
            this.affectPreserved();
            break;
          default:
        }
      }
      this.editor.getSession().selection.on('changeCursor', this.showLock);
    }

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

    this.$watch('value', (newVal) => {
      if (this.getValue() !== newVal) {
        this.silent = true;
        this.isVaryCurrValue = true;

        this.editorValue = newVal;
        if (this.currValue !== newVal) {
          this.clearPlugins();
          if (this.markup) {
            this.parseMarkup();
          }
        }

        const pos = this.editor.session.selection.toJSON();
        this.editor.setValue(this.editorValue, this.cursorStart);
        this.editor.session.selection.fromJSON(pos);

        if (this.currValue !== newVal && this.markup) {
          if (this.plugins.length > 0) {
            for (let idx = this.plugins.length - 1; idx >= 0; idx -= 1) {
              switch (this.plugins[idx]) {
                case 'blank':
                  this.affectBlank();
                  break;
                case 'lock':
                  this.affectPreserved();
                  break;
                default:
              }
            }
          }
          this.editor.getSession().selection.on('changeCursor', this.showLock);
        }

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

    this.$watch('markup', (newVal) => {
      if (newVal) {
        this.clearPlugins();
        this.editorValue = this.getEditorValue();
        this.parseMarkup();
        this.editor.setValue(this.editorValue, this.cursorStart);
        setTimeout(() => {
          if (this.plugins.length > 0) {
            for (let idx = this.plugins.length - 1; idx >= 0; idx -= 1) {
              switch (this.plugins[idx]) {
                case 'blank':
                  this.affectBlank();
                  break;
                case 'lock':
                  this.affectPreserved();
                  break;
                default:
              }
            }
            this.editor.getSession().selection.on('changeCursor', this.showLock);
          }
        });
      } else {
        this.editor.setValue(this.getValue(true), this.cursorStart);

        this.clearPlugins();

        setTimeout(() => {
          this.isReadOnly = false;
          this.editor.setReadOnly(this.isReadOnly);
        }, 0);
      }
    });
  },

  methods: {
    parseMarkup() {
      if (this.markup) {
        // xiaohou-hide
        this.parseHide();

        // xiaohou-blank or xiaohou-lock
        this.parseBlank();
        this.parseLock();
      }
    },
    parseHide() {
      const [fragment0, fragment1] = this.editorValue.match(/<xiaohou-hide>([^]+?)<\/xiaohou-hide>/igm) || [];
      if (fragment0 || fragment1) {
        if (fragment0 && this.editorValue.indexOf(fragment0) !== 0 && !fragment1) {
          this.endCode = fragment0;
        } else {
          this.startCode = fragment0;
          this.endCode = fragment1;
        }

        this.editorValue = this.editorValue.replace(this.startCode, '');
        this.editorValue = this.editorValue.replace(this.endCode, '');

        this.plugins.push('hide');
      }
    },
    parseBlank() {
      if (this.editorValue.indexOf('<xiaohou-blank>') > -1) {
        this.blanks = this.editorValue.match(/<xiaohou-blank>([^]*?)<\/xiaohou-blank>/igm) || [];
        this.blankGaps = this.editorValue.split(/<xiaohou-blank>([^]*?)<\/xiaohou-blank>/im) || [];

        this.plugins.push('blank');
      }
    },
    parseLock() {
      if (this.editorValue.indexOf('<xiaohou-lock>') > -1) {
        this.preserveds = this.editorValue.match(/<xiaohou-lock>([^]*?)<\/xiaohou-lock>/igm) || [];

        this.plugins.push('lock');
      }
    },

    affectBlank() {
      this.blankAnchors = this.produceAnchors('blank');

      this.editor.gotoLine(
        this.blankAnchors[0].start.row + 1,
        this.blankAnchors[0].start.column + 1,
      );

      this.editor.getSession().selection.on('changeCursor', this.protectExternal);
    },
    affectPreserved() {
      this.preservedAnchors = this.produceAnchors('preserved');

      this.editor.gotoLine(0);

      this.editor.getSession().selection.on('changeCursor', this.protectInternal);
    },
    produceAnchors(type) {
      const ranges = this[`${type}s`].map(item => this.editor.find(item));
      return ranges.map((item, index) => {
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

        this.editor.getSession().addMarker(range, `${type}-highlight`);

        let tempStr = '';
        switch (type) {
          case 'blank':
            tempStr = this.blanks[index].replace(/<\/?xiaohou-blank>/ig, ' ');
            break;
          case 'preserved':
            tempStr = this.preserveds[index].replace(/<\/?xiaohou-lock>/ig, '');
            break;
          default:
        }

        this.editor.getSession().replace(
          new Range(
            item.start.row,
            item.start.column,
            item.end.row,
            item.end.column,
          ),
          tempStr,
        );
        range.start = this.editor.getSession().doc.createAnchor(range.start);
        range.end = this.editor.getSession().doc.createAnchor(range.end);
        range.end.$insertRight = true;
        return range;
      });
    },
    clearAnchors(type) {
      const markers = this.editor.getSession().getMarkers();
      Object.keys(markers).forEach((id) => {
        if (markers[id].clazz === `${type}-highlight`) {
          this.editor.getSession().removeMarker(id);
        }
      });

      switch (type) {
        case 'blank':
          this.blanks = [];
          this.blankGaps = [];
          this.blankAnchors = [];
          break;
        case 'preserved':
          this.preserveds = [];
          this.preservedAnchors = [];
          break;
        default:
      }
    },
    clearHide() {
      this.startCode = '';
      this.endCode = '';
    },
    clearPlugins() {
      if (this.plugins.length > 0) {
        for (let idx = this.plugins.length - 1; idx >= 0; idx -= 1) {
          switch (this.plugins[idx]) {
            case 'blank':
              this.clearAnchors('blank');
              this.editor.getSession().selection.off('changeCursor', this.protectExternal);
              break;
            case 'lock':
              this.clearAnchors('preserved');
              this.editor.getSession().selection.off('changeCursor', this.protectInternal);
              break;
            case 'hide':
              this.clearHide();
              break;
            default:
          }
        }
        this.editor.getSession().selection.off('changeCursor', this.showLock);
      }
      this.plugins = [];
    },
    protectInternal() {
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
            && anchor.start.column < selection.end.column)
            || (anchor.start.row === selection.start.row
            && anchor.start.column >= selection.start.column
            && anchor.start.row < selection.end.row)
            || (anchor.start.row > selection.start.row
            && anchor.start.row === selection.end.row
            && anchor.start.column < selection.end.column))
            // 2.仅只读范围终点在选取范围中
            || ((anchor.end.row > selection.start.row
            && anchor.end.row < selection.end.row)
            || (anchor.end.row === selection.start.row
            && anchor.end.column > selection.start.column
            && anchor.end.row === selection.end.row
            && anchor.end.column <= selection.end.column)
            || (anchor.end.row === selection.start.row
            && anchor.end.column > selection.start.column
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
            && anchor.start.column < selection.start.column
            && (anchor.end.row > selection.end.row
            || (anchor.end.row === selection.end.row
            && anchor.end.column > selection.end.column)))
            // 3.3.止在同一行 起可能在同一行
            || (anchor.end.row === selection.end.row
            && anchor.end.column > selection.end.column
            && (anchor.start.row < selection.start.row
            || (anchor.start.row === selection.start.row
            && anchor.start.column < selection.start.column)))
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
    },
    protectExternal() {
      setTimeout(() => {
        const selection = this.editor.getSession().selection.getRange();
        if (this.blankAnchors.some((anchor) => {
          if (
            // 0.单行 选取在填空中
            (anchor.start.row === anchor.end.row
            && anchor.start.row === selection.start.row
            && anchor.start.column < selection.start.column
            && anchor.end.row === selection.end.row
            && anchor.end.column > selection.end.column)
            // 1.多行 选取填空中间某行
            || (anchor.start.row < anchor.end.row
            && anchor.start.row < selection.start.row
            && anchor.end.row > selection.end.row)
            // 2.起在第一行 止可能在填空中
            || (anchor.start.row < anchor.end.row
            && anchor.start.row === selection.start.row
            && anchor.start.column < selection.start.column
            // 2.1.止在第一行
            && ((anchor.start.row === selection.end.row
            && anchor.start.column < selection.end.column)
            // 2.2.止在中间行
            || (anchor.start.row < selection.end.row
            && anchor.end.row > selection.end.row)
            // 2.3.止在最后一行
            || (anchor.end.row === selection.end.row
            && anchor.end.column > selection.end.column)))
            // 3.多行 止在最后一行 起可能在填空中
            || (anchor.start.row < anchor.end.row
            && anchor.end.row === selection.end.row
            && anchor.end.column > selection.end.column
            // 3.1.起在第一行
            && ((anchor.start.row === selection.start.row
            && anchor.start.column < selection.start.column)
            // 3.2.起在中间行
            || (anchor.start.row < selection.start.row
            && anchor.end.row > selection.start.row)
            // 3.3.起在最后一行
            || (anchor.end.row === selection.start.row
            && anchor.end.column > selection.start.column)))
          ) {
            return true;
          }
          return false;
        })) {
          this.isReadOnly = false;
        } else {
          this.isReadOnly = true;
        }
        this.editor.setReadOnly(this.isReadOnly);
      }, 0);
    },

    protectBoundary(evt) {
      // 边界保护
      this.plugins.forEach((plugin) => {
        switch (plugin) {
          case 'blank':
            this.protectBlankBoundary(evt);
            break;
          case 'lock':
            this.protectPreservedBoundary(evt);
            break;
          default:
        }
      });

      if (!this.isReadOnly) {
        this.isVaryCurrValue = true;
      }
    },
    protectBlankBoundary(evt) {
      if (evt.keyCode === 13) {
        evt.preventDefault();
      }
      // 开头禁backspace键 结尾禁del键
      const selection = this.editor.getSession().selection.getRange();
      if (this.blankAnchors.some((anchor) => {
        if ((evt.keyCode === 46
        && anchor.end.row === selection.start.row
        && anchor.end.column - 1 === selection.start.column
        && selection.end.row === selection.start.row
        && selection.end.column === selection.start.column)
        || (evt.keyCode === 8
        && anchor.start.row === selection.start.row
        && anchor.start.column + 1 === selection.start.column
        && selection.end.row === selection.start.row
        && selection.end.column === selection.start.column)) {
          return true;
        }
        return false;
      })) {
        this.isReadOnly = true;
      }
      if (this.blankAnchors.some((anchor) => {
        if (evt.keyCode !== 8
        && anchor.start.row === selection.start.row
        && anchor.start.column + 1 === selection.start.column
        && selection.end.row === selection.start.row
        && selection.end.column === selection.start.column) {
          return true;
        }
        return false;
      })) {
        this.isReadOnly = false;
      }
      this.editor.setReadOnly(this.isReadOnly);

      this.showLock();
    },
    protectPreservedBoundary(evt) {
      // 开头禁del键 结尾禁backspace键
      const selection = this.editor.getSession().selection.getRange();
      if (this.preservedAnchors.some((anchor) => {
        if ((evt.keyCode === 8
        && anchor.end.row === selection.start.row
        && anchor.end.column === selection.start.column
        && selection.end.row === selection.start.row
        && selection.end.column === selection.start.column)
        || (evt.keyCode === 46
        && anchor.start.row === selection.start.row
        && anchor.start.column === selection.start.column
        && selection.end.row === selection.start.row
        && selection.end.column === selection.start.column)) {
          return true;
        }
        return false;
      })) {
        this.isReadOnly = true;
      }
      if (this.preservedAnchors.some((anchor) => {
        if (evt.keyCode !== 8
        && anchor.end.row === selection.start.row
        && anchor.end.column === selection.start.column
        && selection.end.row === selection.start.row
        && selection.end.column === selection.start.column) {
          return true;
        }
        return false;
      })) {
        this.isReadOnly = false;
      }
      this.editor.setReadOnly(this.isReadOnly);

      this.showLock();
    },

    getEditorValue() {
      return this.editor.getValue();
    },

    getExecValue() {
      return this.getValue().replace(/<\/?xiaohou-(hide|lock|blank)>/ig, '');
    },

    getValue(notJudge) {
      if (this.isVaryCurrValue) {
        this.currValue = this.splitCode(notJudge);
        this.isVaryCurrValue = false;
      }
      const code = this.currValue;
      return code;
    },

    splitCode(notJudge) {
      let code = this.getEditorValue();

      if (this.markup || notJudge) {
        this.plugins.forEach((plugin) => {
          switch (plugin) {
            case 'blank':
              code = this.spliceBlanks();
              break;
            case 'lock':
              code = this.splicePreserveds();
              break;
            default:
          }
        });
        code = `${this.startCode}${code}${this.endCode}`;
      }

      return code;
    },
    spliceBlanks() {
      let code = '';

      for (let i = 0, len = this.blankAnchors.length; i < len; i += 1) {
        code = `${code}${this.blankGaps[2 * i]}<xiaohou-blank>${this.editor.getSession().doc.getTextRange(
          new Range(
            this.blankAnchors[i].start.row,
            this.blankAnchors[i].start.column + 1,
            this.blankAnchors[i].end.row,
            this.blankAnchors[i].end.column - 1,
          ),
        )}</xiaohou-blank>`;

        if (i === len - 1) {
          code += this.blankGaps[2 * (i + 1)];
        }
      }

      return code;
    },
    splicePreserveds() {
      let code = '';

      const start = {
        row: 0,
        column: 0,
      };
      for (let i = 0, len = this.preservedAnchors.length; i < len; i += 1) {
        code = `${code}${this.editor.getSession().doc.getTextRange(
          new Range(
            start.row,
            start.column,
            this.preservedAnchors[i].start.row,
            this.preservedAnchors[i].start.column,
          ),
        )}${this.preserveds[i]}`;

        start.row = this.preservedAnchors[i].end.row;
        start.column = this.preservedAnchors[i].end.column;

        if (i === len - 1) {
          const lastRow = this.editor.getSession().getLength() - 1;
          const lastColumn = this.editor.getSession().getLine(lastRow).length;

          code = `${code}${this.editor.getSession().doc.getTextRange(
            new Range(
              start.row,
              start.column,
              lastRow,
              lastColumn,
            ),
          )}`;
        }
      }

      return code;
    },
    checkMarkup() {
      return this.markup && this.plugins.length !== 0;
    },

    showLock() {
      this.isShowLock = true;
      setTimeout(() => {
        this.isShowLock = false;
      }, 500);
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
        this.$emit('change', this.getEditorValue(), event, this.editor);
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
  width: 100%;
  height: 100%;
  background-color: white;
}
.element-lock {
  display: inline-block;
  width: 100px;
  height: 107px;
  position: absolute;
  top: 0;
  right: 10px;
  z-index: 1000;
  background-image: url('~./lock.png');
  opacity: 0;
  transition: opacity .6s;
  &-flash {
    opacity: 1;
  }
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

.preserved-highlight {
  background-color: #333;
  opacity: 0.2;
  position: absolute;
}
.blank-highlight {
  background-color: #fff;
  position: absolute;
  box-sizing: border-box;
  border: 1px solid #333;
  &-flash {
    background-color: rgba(251,203,87,0.64);
  }
}
</style>
