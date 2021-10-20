import type { DebouncedFunc } from 'lodash';
import AceAjax from "ace-builds";
import type { DefineComponent, Ref, WritableComputedRef, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps, PropType } from 'vue';
import type { marker } from "./types/props";
import type { Completer } from "./utils/Completers";
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
        type: PropType<AceAjax.Ace.Annotation[]>;
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
        type: PropType<boolean | Completer[]>;
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
    isShowLock: Ref<boolean>;
    blanks: Ref<any[]>;
    blankGaps: Ref<any[]>;
    blankAnchors: Ref<any[]>;
    parseBlank: () => void;
    affectBlank: () => void;
    protectBlankBoundary: (evt: KeyboardEvent) => void;
    spliceBlanks: () => string;
    protectExternal: () => void;
    startCode: Ref<string>;
    endCode: Ref<string>;
    clearHide: () => void;
    parseHide: () => void;
    preserveds: Ref<string[]>;
    preservedAnchors: Ref<AceAjax.Ace.Range[]>;
    parseLock: () => void;
    showLock: () => void;
    splicePreserveds: () => string;
    affectPreserved: () => void;
    protectPreservedBoundary: (evt: KeyboardEvent) => void;
    protectInternal: () => void;
    plugins: Ref<("lock" | "blank" | "hide")[]>;
    clearPlugins: () => void;
    protectBoundary: (evt: KeyboardEvent) => void;
    insertAndSelect: (txt: string, pos?: string, focus?: boolean) => void;
    formatCode: () => void;
    addMarkup: () => void;
    insert: (text: string, focus?: boolean) => void;
    select: (row: number, col: number, length: number, focus?: boolean) => void;
    isReadOnly: WritableComputedRef<boolean>;
    getValue: (notJudge?: boolean) => string;
    refEditor: Ref<HTMLElement | undefined>;
    editor: {
        value: AceAjax.Ace.Editor;
    };
    resize: DebouncedFunc<() => void>;
    genSid: () => void;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("change" | "focus" | "input" | "blur" | "copy" | "paste" | "selection-change" | "cursor-change" | "scroll" | "handle-options")[], "focus" | "change" | "input" | "blur" | "copy" | "paste" | "selection-change" | "cursor-change" | "scroll" | "handle-options", VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<{
    mode?: unknown;
    focus?: unknown;
    theme?: unknown;
    width?: unknown;
    height?: unknown;
    fontSize?: unknown;
    showGutter?: unknown;
    value?: unknown;
    minLines?: unknown;
    maxLines?: unknown;
    readOnly?: unknown;
    markup?: unknown;
    removeMark?: unknown;
    highlightActiveLine?: unknown;
    tabSize?: unknown;
    showPrintMargin?: unknown;
    cursorStart?: unknown;
    debounceChangePeriod?: unknown;
    editorProps?: unknown;
    setOptions?: unknown;
    scrollMargin?: unknown;
    annotations?: unknown;
    markers?: unknown;
    keyboardHandler?: unknown;
    wrapEnabled?: unknown;
    enableBasicAutocompletion?: unknown;
    enableLiveAutocompletion?: unknown;
    navigateToFileEnd?: unknown;
    commands?: unknown;
    placeholder?: unknown;
    preventPasteOther?: unknown;
} & {
    mode: string;
    focus: boolean;
    theme: string;
    width: string;
    height: string;
    fontSize: string | number;
    showGutter: boolean;
    value: string;
    minLines: number;
    maxLines: number;
    readOnly: boolean;
    markup: boolean;
    removeMark: boolean;
    highlightActiveLine: boolean;
    tabSize: number;
    showPrintMargin: boolean;
    cursorStart: number;
    editorProps: Record<string, any>;
    setOptions: Record<string, any>;
    scrollMargin: number[];
    wrapEnabled: boolean;
    enableBasicAutocompletion: boolean;
    enableLiveAutocompletion: boolean | Completer[];
    navigateToFileEnd: boolean;
    placeholder: string;
    preventPasteOther: boolean;
} & {
    debounceChangePeriod?: number | undefined;
    annotations?: AceAjax.Ace.Annotation[] | undefined;
    markers?: marker[] | undefined;
    keyboardHandler?: string | undefined;
    commands?: unknown[] | undefined;
}> & {
    onChange?: ((...args: any[]) => any) | undefined;
    onFocus?: ((...args: any[]) => any) | undefined;
    onInput?: ((...args: any[]) => any) | undefined;
    onBlur?: ((...args: any[]) => any) | undefined;
    onCopy?: ((...args: any[]) => any) | undefined;
    onPaste?: ((...args: any[]) => any) | undefined;
    "onSelection-change"?: ((...args: any[]) => any) | undefined;
    "onCursor-change"?: ((...args: any[]) => any) | undefined;
    onScroll?: ((...args: any[]) => any) | undefined;
    "onHandle-options"?: ((...args: any[]) => any) | undefined;
}, {
    mode: string;
    focus: boolean;
    theme: string;
    width: string;
    height: string;
    fontSize: string | number;
    showGutter: boolean;
    value: string;
    minLines: number;
    maxLines: number;
    readOnly: boolean;
    markup: boolean;
    removeMark: boolean;
    highlightActiveLine: boolean;
    tabSize: number;
    showPrintMargin: boolean;
    cursorStart: number;
    editorProps: Record<string, any>;
    setOptions: Record<string, any>;
    scrollMargin: number[];
    wrapEnabled: boolean;
    enableBasicAutocompletion: boolean;
    enableLiveAutocompletion: boolean | Completer[];
    navigateToFileEnd: boolean;
    placeholder: string;
    preventPasteOther: boolean;
}>;
export default _default;
