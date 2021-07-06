import { Ace } from "ace-builds";

import { Props } from "./types/props";

const editorOptions: Array<keyof (Props | Ace.EditorOptions)> = [
  "minLines",
  "maxLines",
  "readOnly",
  "highlightActiveLine",
  "tabSize",
  "enableBasicAutocompletion",
  "enableLiveAutocompletion",
  // 'enableSnippets',
];

const editorEvents = [
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
];

export { editorEvents, editorOptions };
