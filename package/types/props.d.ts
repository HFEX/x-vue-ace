import AceAjax from "brace";

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
  setOptions: Record<string, any>;
  scrollMargin: number[];
  annotations?: AceAjax.Annotation[];
  markers?: marker[];
  keyboardHandler?: string;
  wrapEnabled: boolean;
  enableBasicAutocompletion: boolean;
  enableLiveAutocompletion: boolean;
  navigateToFileEnd: boolean;
  commands?: unknown[];
  placeholder: string;
  preventPasteOther: boolean;
}>;

export interface marker {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  className: string;
  type: string;
  inFront?: boolean;
}
