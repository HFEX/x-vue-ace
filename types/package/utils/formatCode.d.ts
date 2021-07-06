import ace from "ace-builds";
import { Ref } from "vue";
interface Params {
    affectPreserved: () => void;
    affectBlank: () => void;
    showLock: () => void;
    editor: {
        value: ace.Ace.Editor;
    };
    plugins: Ref<string[]>;
}
export default function getFormatfunction({ affectPreserved, affectBlank, editor, plugins, showLock, }: Params): () => void;
export {};
