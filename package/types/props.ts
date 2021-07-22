import AceAjax from "ace-builds";

import type { Completer } from "../utils/Completers";

export type Props = Readonly<{
  mode: string;
  focus: boolean;
  theme: string;
  width: string;
  height: string;
  fontSize: number | string;
  showGutter: boolean;
  value: string;
  // defaultValue: PropTypes.string,
  minLines: number;
  maxLines: number;
  readOnly: boolean;
  markup: boolean;
  removeMark: boolean;
  highlightActiveLine: boolean;
  tabSize: number;
  showPrintMargin: boolean;
  cursorStart: number;
  debounceChangePeriod?: number;
  editorProps: Record<string, any>;
  setOptions: Record<keyof AceAjax.Ace.EditorOptions, any>;
  scrollMargin: number[];
  annotations?: AceAjax.Ace.Annotation[];
  markers?: marker[];
  keyboardHandler?: string;
  wrapEnabled: boolean;
  enableBasicAutocompletion: boolean;
  enableLiveAutocompletion: boolean;
  navigateToFileEnd: boolean;
  commands?: unknown[];
  placeholder: string;
  preventPasteOther: boolean;
  completer?: Completer;
}>;

export interface marker {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  className: string;
  type: "fullLine" | "screenLine" | "text" | AceAjax.Ace.MarkerRenderer;
  inFront?: boolean;
}
