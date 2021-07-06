import type { Ace } from "ace-builds";
import type { Props } from "./types/props";
export default function watchAnnotations(editor: {
    value: Ace.Editor;
}, props: Props): void;
