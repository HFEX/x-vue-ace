import { Editor } from "brace";
import { Ref } from "vue";
interface Params {
    affectPreserved: () => void;
    affectBlank: () => void;
    showLock: () => void;
    editor: {
        value: Editor;
    };
    plugins: Ref<string[]>;
}
export default function getFormatfunction({ affectPreserved, affectBlank, editor, plugins, showLock, }: Params): () => void;
export {};
