import type { Editor } from "brace";
import { Ref } from "vue";
import type { Plugins } from "./pluginsRef";
import { Props } from "./types/props";
declare namespace editorRef {
    interface params {
        getValue: (notJudge?: boolean) => string;
        isVaryCurrValue: Ref<boolean>;
        currValue: Ref<string>;
        isReadOnly: Ref<boolean>;
        parseMarkup: () => void;
        removeMarkup: () => void;
        formatCode: () => void;
    }
}
/**
 * 创建编辑器实例
 * @param el 用于挂载的dom节点
 * @param editorValue 编辑器初始值
 * @param props 组件props
 * @returns
 */
export default function getEditorRef(el: Ref<HTMLElement | undefined>, editorValue: Ref<string>, selectedText: Ref<string>, silent: Ref<boolean>, emit: (evt: "beforeLoad" | "change" | "focus" | "blur" | "copy" | "paste" | "input", ...args: any[]) => void, sid: Ref<string>, props: Props): {
    editor: {
        value: Editor;
    };
    /**
     * 获取编辑器的值，如果编辑器为空，返回内存中的值
     * @returns string
     */
    getEditorValue: () => string;
    watchEditorValue: ({ getValue, isVaryCurrValue, currValue, isReadOnly, removeMarkup, parseMarkup, formatCode, }: editorRef.params, { plugins, clearPlugins }: Plugins) => void;
};
export declare function removeMarkup(editorValue: Ref<string>): void;
export {};
