import ace from "ace-builds";
import { Ref, ref } from "vue";

import { produceAnchors } from "../utils/Anchors";
const Range: typeof ace.Range = ace.require("ace/range").Range;

interface params {
  editor: { value: ace.Ace.Editor };
  editorValue: Ref<string>;
  plugins: Ref<Array<string>>;
  isReadOnly: Ref<boolean>;
  showLock: () => void;
}
export function useBlankPlugin({
  editor,
  editorValue,
  plugins,
  isReadOnly,
  showLock,
}: params): BlankPlugin {
  const blanks = ref<Array<any>>([]); // 空白处初始内容
  const blankGaps = ref<Array<any>>([]); // 空白与空白之间内容
  const blankAnchors = ref<Array<any>>([]); // 空白范围
  function parseBlank() {
    if (editorValue.value.indexOf("<xiaohou-blank>") > -1) {
      blanks.value = editorValue.value.match(/<xiaohou-blank>([^]*?)<\/xiaohou-blank>/gim) || [];
      blankGaps.value = editorValue.value.split(/<xiaohou-blank>([^]*?)<\/xiaohou-blank>/im) || [];
      plugins.value.push("blank");
    }
  }
  function protectExternal() {
    setTimeout(() => {
      const selection = editor.value.getSession().selection.getRange();
      if (
        blankAnchors.value.some((anchor) => {
          if (
            // 0.单行 选取在填空中
            (anchor.start.row === anchor.end.row &&
              anchor.start.row === selection.start.row &&
              anchor.start.column < selection.start.column &&
              anchor.end.row === selection.end.row &&
              anchor.end.column > selection.end.column) ||
            // 1.多行 选取填空中间某行
            (anchor.start.row < anchor.end.row &&
              anchor.start.row < selection.start.row &&
              anchor.end.row > selection.end.row) ||
            // 2.起在第一行 止可能在填空中
            (anchor.start.row < anchor.end.row &&
              anchor.start.row === selection.start.row &&
              anchor.start.column < selection.start.column &&
              // 2.1.止在第一行
              ((anchor.start.row === selection.end.row &&
                anchor.start.column < selection.end.column) ||
                // 2.2.止在中间行
                (anchor.start.row < selection.end.row && anchor.end.row > selection.end.row) ||
                // 2.3.止在最后一行
                (anchor.end.row === selection.end.row &&
                  anchor.end.column > selection.end.column))) ||
            // 3.多行 止在最后一行 起可能在填空中
            (anchor.start.row < anchor.end.row &&
              anchor.end.row === selection.end.row &&
              anchor.end.column > selection.end.column &&
              // 3.1.起在第一行
              ((anchor.start.row === selection.start.row &&
                anchor.start.column < selection.start.column) ||
                // 3.2.起在中间行
                (anchor.start.row < selection.start.row && anchor.end.row > selection.start.row) ||
                // 3.3.起在最后一行
                (anchor.end.row === selection.start.row &&
                  anchor.end.column > selection.start.column)))
          ) {
            return true;
          }
          return false;
        })
      ) {
        isReadOnly.value = false;
      } else {
        isReadOnly.value = true;
      }
      // editor.setReadOnly(isReadOnly.value);
    }, 0);
  }
  function affectBlank() {
    blankAnchors.value = produceAnchors("blank", blanks.value, editor.value);
    editor.value.gotoLine(
      blankAnchors.value[0].start.row + 1,
      blankAnchors.value[0].start.column + 1,
      false
    );
    editor.value.getSession().selection.on("changeCursor", protectExternal);
  }
  function protectBlankBoundary(evt: KeyboardEvent) {
    if (evt.keyCode === 13) {
      evt.preventDefault();
    }
    // 开头禁backspace键 结尾禁del键
    const selection = editor.value.getSession().selection.getRange();
    if (
      blankAnchors.value.some((anchor) => {
        if (
          (evt.keyCode === 46 && // del键
            anchor.end.row === selection.start.row && // 并且 挖空的最后一行 等于 选中区域的第一行
            anchor.end.column - 1 === selection.start.column && // 并且 挖空的最后一行的倒数第二格 等于 选中区域的第一行的第一格
            selection.end.row === selection.start.row && // 并且 选中区域只有一行
            selection.end.column === selection.start.column) || // 并且 选中区域就一格
          // 以上逻辑是代表 光标停在了 挖空的 倒数第二格，用户按了 del 键
          (evt.keyCode === 8 && // backspace 键
            anchor.start.row === selection.start.row && // 并且 挖空的第一行 等于 选中区域的第一行
            anchor.start.column + 1 === selection.start.column && // 并且 挖空的第二格 等于 选中区域的第一格
            selection.end.row === selection.start.row && // 并且 选中区域只有一行
            selection.end.column === selection.start.column)
        ) {
          // 并且选中区域只有一格
          // 以上逻辑是代表 光标停在了 挖空的 第二格，用户按了 backspace 键
          return true;
        }
        return false;
      })
    ) {
      isReadOnly.value = true;
    }
    if (
      blankAnchors.value.some((anchor) => {
        if (
          evt.keyCode !== 8 &&
          evt.keyCode !== 46 && // 非 backspace 和 非 del 键
          anchor.start.row === selection.start.row && // 并且 挖空的第一行 等于 选中区域的第一行
          anchor.start.column + 1 === selection.start.column && // 并且 挖空的第二格 等于 选中区域的第一格
          selection.end.row === selection.start.row && // 并且 选中区域只有一行
          selection.end.column === selection.start.column
        ) {
          // 并且选中区域只有一格
          // 以上逻辑是代表 光标停在了 挖空的 第二格，用户按了 非 backspace 和 非 del 键
          return true;
        }
        return false;
      })
    ) {
      isReadOnly.value = false;
    }
    // editor.value.setReadOnly(isReadOnly.value);

    showLock();
  }
  function spliceBlanks() {
    let code = "";

    for (let i = 0, len = blankAnchors.value.length; i < len; i += 1) {
      code = `${code}${blankGaps.value[2 * i]}<xiaohou-blank>${editor.value
        .getSession()
        .doc.getTextRange(
          new Range(
            blankAnchors.value[i].start.row,
            blankAnchors.value[i].start.column + 1,
            blankAnchors.value[i].end.row,
            blankAnchors.value[i].end.column - 1
          )
        )}</xiaohou-blank>`;

      if (i === len - 1) {
        code += blankGaps.value[2 * (i + 1)];
      }
    }

    return code;
  }
  return {
    blanks,
    blankGaps,
    blankAnchors,
    parseBlank,
    affectBlank,
    protectBlankBoundary,
    spliceBlanks,
    protectExternal,
  };
}

export interface BlankPlugin {
  blanks: Ref<Array<any>>;
  blankGaps: Ref<Array<any>>;
  blankAnchors: Ref<Array<any>>;
  parseBlank: () => void;
  affectBlank: () => void;
  protectBlankBoundary: (evt: KeyboardEvent) => void;
  spliceBlanks: () => string;
  protectExternal: () => void;
}
