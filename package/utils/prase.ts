// content 整段文本
// splitCode 分隔字段
// mode 换行模式，分隔字段前添加 before,分隔字段后添加 after
function wrapParse(content:string, splitCode:string, mode: 'before'|'after'):string {
  const arr = content.split(splitCode);
  if (arr) {
    const len = arr.length;
    const regBefore = new RegExp(/[\f\n\r]$/);
    const regAfter = new RegExp(/^[\f\n\r]/);
    if (mode === 'before') {
      arr.forEach((item, index) => {
        if (index === 0) {
          if (arr[0].match(/^\s+$/)) {
            arr[0] = '';
          }
        } else if (arr[index - 1] && !arr[index - 1].match(regBefore)) {
          arr[index - 1] += '\n';
        }
      });
    }
    if (mode === 'after') {
      arr.forEach((item, index) => {
        if (index === len - 1) {
          if (arr[len - 1].match(/^\s+$/)) {
            arr[len - 1] = '';
          }
        } else if (arr[index + 1] && !arr[index + 1].match(regAfter)) {
          arr[index + 1] = `\n${arr[index + 1]}`;
        }
      });
    }
    return arr.join(splitCode);
  }
  return content;
}

// blank lock 同时存在时，处理blank,删掉 lock
// hide , lock 只存在于首尾，中间位置的为非法格式，处理掉
export default function beforeParse(editorValue:string):string {
  if (editorValue.indexOf('<xiaohou-blank>') > -1) {
    editorValue = editorValue.replace(/<\/?xiaohou-lock>/igm, '');
  }
  // this.editorValue = this.wrapParse(this.editorValue, '<xiaohou-hide>', 'before');
  // this.editorValue = this.wrapParse(this.editorValue, '</xiaohou-hide>', 'after');
  editorValue = wrapParse(editorValue, '<xiaohou-lock>', 'before');
  editorValue = wrapParse(editorValue, '</xiaohou-lock>', 'after');
  return editorValue;
}
