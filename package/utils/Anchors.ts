import * as ace from "brace";
import { Ref } from "vue";

const Range: typeof ace.Range = ace.acequire("ace/range").Range;

export function produceAnchors(type: string, arr: string[], editor: ace.Editor) {
  const ranges = arr.map((item) => editor.find(item) as unknown as ace.Range);
  ranges.sort((a, b) => {
    const arow = a.start.row;
    const brow = b.start.row;
    const acolumn = a.start.column;
    const bcolumn = b.start.column;
    if (arow > brow || (arow === brow && acolumn > bcolumn)) {
      return 1;
    }
    return -1;
  });
  let rate = 0;
  return ranges.map((item, index) => {
    let range: ace.Range;
    if (index > 0 && item.start.row === ranges[index - 1].start.row) {
      rate += 1;
    } else {
      rate = 0;
    }
    if (item.start.row === item.end.row) {
      range = new Range(
        item.start.row,
        item.start.column - rate * 29,
        item.end.row,
        item.end.column - (rate + 1) * 29
      );
    } else {
      range = new Range(
        item.start.row,
        item.start.column - rate * 29,
        item.end.row,
        item.end.column - 15
      );
    }
    // @ts-ignore
    editor.getSession().addMarker(range, `${type}-highlight`);

    let tempStr = "";
    switch (type) {
      case "preserved":
        tempStr = arr[index].replace(/<\/?xiaohou-lock>/gim, "");
        break;
      case "blank":
        tempStr = arr[index].replace(/<\/?xiaohou-blank>/gim, " ");
        break;
      default:
    }
    if (item.start.row === item.end.row) {
      editor
        .getSession()
        .replace(
          new Range(
            item.start.row,
            item.start.column - rate * 29,
            item.end.row,
            item.end.column - rate * 29
          ),
          tempStr
        );
    } else {
      editor
        .getSession()
        .replace(
          new Range(item.start.row, item.start.column - rate * 29, item.end.row, item.end.column),
          tempStr
        );
    }
    // @ts-ignore
    range.start = editor.getSession().doc.createAnchor(range.start);
    // @ts-ignore
    range.end = editor.getSession().doc.createAnchor(range.end);
    // @ts-ignore
    range.end.$insertRight = true;
    return range;
  });
}
export function clearAnchors(
  type: string,
  editor: ace.Editor,
  ...arrs: Array<Ref<Array<unknown>>>
) {
  const markers = editor.getSession().getMarkers(false);
  Object.keys(markers).forEach((id) => {
    // @ts-ignore
    if (markers[id].clazz === `${type}-highlight`) {
      // @ts-ignore
      editor.getSession().removeMarker(id);
    }
  });

  arrs.forEach((arr) => {
    arr.value = [];
  });
}
