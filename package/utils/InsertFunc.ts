// 已废弃
// @ts-nocheck
export function insert(text, focus:boolean = true) {
  if (this.isReadOnly || this.readOnly) {
    return;
  }

  this.editor.insert(text);
  this.isVaryCurrValue = true;
  if (focus) this.editor.focus();
}

export function insertAndSelect(txt, pos = '', focus = true) {
  const { start } = this.editor.getSelection().getRange();
  const currLine = this.editor.getSession().getDocument().getLine(start.row);
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
    const posArr = pos
      .split(/,|，/)
      .map(v => parseInt(v, 10));

    this.insert(text, focus);
    const p1 = posArr[0] - 1 || 0;
    const r = start.row + p1;
    let c = (
      posArr[0] > 1
        ? (posArr[1] || 0)
        : (posArr[1] || 0) + start.column
    );
    // 如果存在缩进&&要选中的是第二行及之后，则加上缩进的位移
    if (
      m
      && p1 > 0
    ) {
      c += m[0].length;
    }

    this.select(
      r,
      c,
      posArr[2],
      focus,
    );
    return;
  }

  this.insert(text, focus);
}
