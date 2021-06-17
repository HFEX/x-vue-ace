import { readonly } from "vue";

const editorOptions = readonly<
  [
    "minLines",
    "maxLines",
    "readOnly",
    "highlightActiveLine",
    "tabSize",
    "enableBasicAutocompletion",
    "enableLiveAutocompletion"
    // 'enableSnippets',
  ]
>([
  "minLines",
  "maxLines",
  "readOnly",
  "highlightActiveLine",
  "tabSize",
  "enableBasicAutocompletion",
  "enableLiveAutocompletion",
  // 'enableSnippets',
]);

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
