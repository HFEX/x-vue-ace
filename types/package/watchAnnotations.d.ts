import type { Props } from "./types/props";
import type { Editor } from 'brace';
export default function watchAnnotations(editor: {
    value: Editor;
}, props: Props): void;
