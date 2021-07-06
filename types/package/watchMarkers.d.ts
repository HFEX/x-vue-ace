import ace from "ace-builds";
import type { Props } from "./types/props";
export default function watchMarkers(editor: {
    value: ace.Ace.Editor;
}, props: Props): void;
