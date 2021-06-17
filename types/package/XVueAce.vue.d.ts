import AceAjax from "brace";
import type { DefineComponent, WritableComputedRef, Ref, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps, PropType } from 'vue';
import type { marker } from "./types/props";
declare const _default: DefineComponent<{
    mode: {
        type: StringConstructor;
        default: string;
    };
    focus: {
        type: BooleanConstructor;
        default: boolean;
    };
    theme: {
        type: StringConstructor;
        default: string;
    };
    width: {
        type: StringConstructor;
        default: string;
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    fontSize: {
        type: (StringConstructor | NumberConstructor)[];
        default: number;
    };
    showGutter: {
        type: BooleanConstructor;
        default: boolean;
    };
    value: {
        type: StringConstructor;
        default: string;
    };
    minLines: {
        type: NumberConstructor;
        default: null;
    };
    maxLines: {
        type: NumberConstructor;
        default: null;
    };
    readOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    markup: {
        type: BooleanConstructor;
        default: boolean;
    };
    removeMark: {
        type: BooleanConstructor;
        default: boolean;
    };
    highlightActiveLine: {
        type: BooleanConstructor;
        default: boolean;
    };
    tabSize: {
        type: NumberConstructor;
        default: number;
    };
    showPrintMargin: {
        type: BooleanConstructor;
        default: boolean;
    };
    cursorStart: {
        type: NumberConstructor;
        default: number;
    };
    debounceChangePeriod: {
        type: NumberConstructor;
    };
    editorProps: {
        type: ObjectConstructor;
        default: () => {};
    };
    setOptions: {
        type: ObjectConstructor;
        default: () => {};
    };
    scrollMargin: {
        type: PropType<number[]>;
        default: () => number[];
    };
    annotations: {
        type: PropType<AceAjax.Annotation[]>;
    };
    markers: {
        type: PropType<marker[]>;
    };
    keyboardHandler: {
        type: StringConstructor;
    };
    wrapEnabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    enableBasicAutocompletion: {
        type: BooleanConstructor;
        default: boolean;
    };
    enableLiveAutocompletion: {
        type: BooleanConstructor;
        default: boolean;
    };
    navigateToFileEnd: {
        type: BooleanConstructor;
        default: boolean;
    };
    commands: {
        type: ArrayConstructor;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    preventPasteOther: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    protectBoundary: (evt: KeyboardEvent) => void;
    insertAndSelect: (txt: string, pos?: string, focus?: boolean) => void;
    formatCode: () => void;
    addMarkup: () => void;
    insert: (text: string, focus?: boolean) => void;
    select: (row: number, col: number, length: number, focus?: boolean) => void;
    isReadOnly: WritableComputedRef<boolean>;
    getValue: (notJudge?: boolean) => string;
    refEditor: Ref<HTMLElement | undefined>;
    isShowLock: Ref<boolean>;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("copy" | "input" | "blur" | "change" | "focus" | "scroll" | "paste" | "selection-change" | "cursor-change" | "handle-options" | "beforeLoad")[], "copy" | "input" | "blur" | "change" | "focus" | "scroll" | "paste" | "selection-change" | "cursor-change" | "handle-options" | "beforeLoad", VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<{
    focus: boolean;
    value: string;
    mode: string;
    minLines: number;
    maxLines: number;
    readOnly: boolean;
    highlightActiveLine: boolean;
    tabSize: number;
    enableBasicAutocompletion: boolean;
    enableLiveAutocompletion: boolean;
    theme: string;
    width: string;
    height: string;
    fontSize: string | number;
    showGutter: boolean;
    markup: boolean;
    removeMark: boolean;
    showPrintMargin: boolean;
    cursorStart: number;
    editorProps: Record<string, any>;
    setOptions: Record<string, any>;
    scrollMargin: number[];
    wrapEnabled: boolean;
    navigateToFileEnd: boolean;
    placeholder: string;
    preventPasteOther: boolean;
} & {
    markers?: marker[] | undefined;
    debounceChangePeriod?: number | undefined;
    annotations?: AceAjax.Annotation[] | undefined;
    keyboardHandler?: string | undefined;
    commands?: unknown[] | undefined;
}>, {
    focus: boolean;
    value: string;
    mode: string;
    minLines: number;
    maxLines: number;
    readOnly: boolean;
    highlightActiveLine: boolean;
    tabSize: number;
    enableBasicAutocompletion: boolean;
    enableLiveAutocompletion: boolean;
    theme: string;
    width: string;
    height: string;
    fontSize: string | number;
    showGutter: boolean;
    markup: boolean;
    removeMark: boolean;
    showPrintMargin: boolean;
    cursorStart: number;
    editorProps: Record<string, any>;
    setOptions: Record<string, any>;
    scrollMargin: number[];
    wrapEnabled: boolean;
    navigateToFileEnd: boolean;
    placeholder: string;
    preventPasteOther: boolean;
}>;
export default _default;
