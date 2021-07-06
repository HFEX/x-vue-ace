import { Ace } from "ace-builds";
import { Props } from "./types/props";
declare const editorOptions: Array<keyof (Props | Ace.EditorOptions)>;
declare const editorEvents: string[];
export { editorEvents, editorOptions };
