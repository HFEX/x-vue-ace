import { Ref } from "vue";
export declare function useHideCodePlugin(editorValue: Ref<string>, plugins: Ref<Array<string>>): HideCodePlugin;
export interface HideCodePlugin {
    startCode: Ref<string>;
    endCode: Ref<string>;
    clearHide: () => void;
    parseHide: () => void;
}
