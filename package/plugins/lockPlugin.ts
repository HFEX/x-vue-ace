import { Editor, Range } from 'brace';
import { Ref, ref } from 'vue'
import { produceAnchors } from "../utils/Anchors";
interface params {
  editor: {value:Editor},
  editorValue: Ref<string>,
  plugins: Ref<Array<string>>,
  isReadOnly: Ref<boolean>
}
export function useLockPlugin({editor,editorValue,plugins,isReadOnly}:params):LockPlugin {
  const isShowLock = ref(false) // 是否展示锁 🔒
  const showLock = () =>{
    isShowLock.value = true;
    setTimeout(() => {
      isShowLock.value = false;
    }, 500);
  }

  const preserveds = ref([] as string[]) // 只读处初始内容
  const preservedGaps = ref([] as string[])
  const preservedAnchors = ref([] as Range[]) // 只读范围
  const splicePreserveds = () => {
    let code = '';

    const start = {
      row: 0,
      column: 0,
    };
    for (let i = 0, len = preservedAnchors.value.length; i < len; i += 1) {
      code = `${code}${editor.value.getSession().doc.getTextRange(
        new Range(
          start.row,
          start.column,
          preservedAnchors.value[i].start.row,
          preservedAnchors.value[i].start.column,
        ),
      )}${preserveds.value[i]}`;

      start.row = preservedAnchors.value[i].end.row;
      start.column = preservedAnchors.value[i].end.column;

      if (i === len - 1) {
        const lastRow = editor.value.getSession().getLength() - 1;
        const lastColumn = editor.value.getSession().getLine(lastRow).length;

        code = `${code}${editor.value.getSession().doc.getTextRange(
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
  }
  const parseLock = () => {
    if (editorValue.value.indexOf('<xiaohou-lock>') > -1) {
      preserveds.value = editorValue.value.match(/<xiaohou-lock>([^]*?)<\/xiaohou-lock>/igm) || [];
      preservedGaps.value = editorValue.value.split(/<xiaohou-lock>([^]*?)<\/xiaohou-lock>/igm) || [];
      plugins.value.push('lock');
    }
  }
  function protectInternal() {
    setTimeout(() => {
      const selection = editor.value.getSession().selection.getRange();
      if (preservedAnchors.value.some((anchor) => {
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
        isReadOnly.value = true;
      } else {
        isReadOnly.value = false;
      }
      // editor.setReadOnly(isReadOnly.value);
    }, 0);
  }
  const affectPreserved = () => {
    preservedAnchors.value = produceAnchors('preserved',preservedAnchors.value,editor.value);

    editor.value.gotoLine(0);

    editor.value.getSession().selection.on('changeCursor', protectInternal);
  }
  const protectPreservedBoundary = (evt:KeyboardEvent) => {
    // 被锁定行的下一行开头禁backspace键 被锁定行的上一行结尾禁del键
    const selection = editor.value.getSession().selection.getRange();
    const startA = selection.start.row;
    const endA = selection.end.row;
    const len = editor.value.session.getLine(endA).length;
    if (preservedAnchors.value.some((anchor) => {
      const startB = anchor.start.row;
      const endB = anchor.end.row;
      if (Math.max(startA, startB) <= Math.min(endA, endB)) {
        return true;
      }
      if (evt.keyCode === 8) {
        if (Math.max(startA - 1, startB) <= Math.min(endA - 1, endB)
            && selection.start.column === 0) {
          return true;
        }
      }
      if (evt.keyCode === 46) {
        if (Math.max(startA + 1, startB) <= Math.min(endA + 1, endB)
            && selection.end.column === len) {
          return true;
        }
      }
      return false;
    })) {
      isReadOnly.value = true;
    } else {
      isReadOnly.value = false;
    }
    // editor.value.setReadOnly(isReadOnly.value);
    showLock();
  }
  return {
    isShowLock,
    preserveds,
    preservedAnchors,
    parseLock,
    showLock,
    splicePreserveds,
    affectPreserved,
    protectPreservedBoundary,
    protectInternal,
  }
}

export interface LockPlugin {
  isShowLock: Ref<boolean>,
  preserveds: Ref<string[]>,
  preservedAnchors: Ref<Range[]>,
  parseLock: ()=>void,
  showLock: ()=>void,
  splicePreserveds: ()=>string,
  affectPreserved:()=>void,
  protectPreservedBoundary: (evt: KeyboardEvent) => void,
  protectInternal:()=>void,
}
