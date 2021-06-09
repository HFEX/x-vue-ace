import type { Annotation, Range } from 'brace';
import type { marker } from '../package/types/props';
import type { DefineComponent, Ref, ComponentInternalInstance, VNodeProps, AllowedComponentProps, ComponentCustomProps, Slot, ComponentPublicInstance, ComponentOptionsBase, WritableComputedRef, ComponentOptionsMixin, ReactiveEffect, nextTick, WatchOptions, WatchStopHandle, ShallowUnwrapRef, ComponentCustomProperties, PropType, EmitsOptions } from 'vue';
/// <reference types="brace" />
declare const _default: DefineComponent<{}, {
    handleInsert: () => void;
    handleRemoveMark: () => void;
    toggleMarkup: () => void;
    fontSize: Ref<number>;
    enableMarkup: Ref<boolean>;
    removeMark: Ref<boolean>;
    editorRef: Ref<({
        $: ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            focus: boolean;
            minLines: number;
            maxLines: number;
            readOnly: boolean;
            highlightActiveLine: boolean;
            tabSize: number;
            enableBasicAutocompletion: boolean | unknown[];
            enableLiveAutocompletion: boolean | unknown[];
            value: string;
            mode: string;
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
            scrollMargin: unknown[];
            wrapEnabled: boolean;
            navigateToFileEnd: boolean;
            placeholder: string;
            preventPasteOther: boolean;
        }> & Omit<Readonly<{
            focus: boolean;
            minLines: number;
            maxLines: number;
            readOnly: boolean;
            highlightActiveLine: boolean;
            tabSize: number;
            enableBasicAutocompletion: boolean | unknown[];
            enableLiveAutocompletion: boolean | unknown[];
            value: string;
            mode: string;
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
            scrollMargin: unknown[];
            wrapEnabled: boolean;
            navigateToFileEnd: boolean;
            placeholder: string;
            preventPasteOther: boolean;
        } & {
            markers?: marker[] | undefined;
            debounceChangePeriod?: number | undefined;
            annotations?: Annotation[] | undefined;
            keyboardHandler?: string | undefined;
            commands?: unknown[] | undefined;
        }> & VNodeProps & AllowedComponentProps & ComponentCustomProps, "focus" | "minLines" | "maxLines" | "readOnly" | "highlightActiveLine" | "tabSize" | "enableBasicAutocompletion" | "enableLiveAutocompletion" | "value" | "mode" | "theme" | "width" | "height" | "fontSize" | "showGutter" | "markup" | "removeMark" | "showPrintMargin" | "cursorStart" | "editorProps" | "setOptions" | "scrollMargin" | "wrapEnabled" | "navigateToFileEnd" | "placeholder" | "preventPasteOther">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: Slot | undefined;
        }>;
        $root: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $parent: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}>> | null;
        $emit: (event: "copy" | "input" | "blur" | "change" | "focus" | "scroll" | "paste" | "selection-change" | "cursor-change" | "handle-options" | "beforeLoad", ...args: any[]) => void;
        $el: any;
        $options: ComponentOptionsBase<Readonly<{
            focus: boolean;
            minLines: number;
            maxLines: number;
            readOnly: boolean;
            highlightActiveLine: boolean;
            tabSize: number;
            enableBasicAutocompletion: boolean | unknown[];
            enableLiveAutocompletion: boolean | unknown[];
            value: string;
            mode: string;
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
            scrollMargin: unknown[];
            wrapEnabled: boolean;
            navigateToFileEnd: boolean;
            placeholder: string;
            preventPasteOther: boolean;
        } & {
            markers?: marker[] | undefined;
            debounceChangePeriod?: number | undefined;
            annotations?: Annotation[] | undefined;
            keyboardHandler?: string | undefined;
            commands?: unknown[] | undefined;
        }>, {
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
            isShowLock: Ref<boolean>;
            preserveds: Ref<string[]>;
            preservedAnchors: Ref<Range[]>;
            parseLock: () => void;
            showLock: () => void;
            splicePreserveds: () => string;
            affectPreserved: () => void;
            protectPreservedBoundary: (evt: KeyboardEvent) => void;
            protectInternal: () => void;
            plugins: Ref<("hide" | "blank" | "lock")[]>;
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
        }, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("copy" | "input" | "blur" | "change" | "focus" | "scroll" | "paste" | "selection-change" | "cursor-change" | "handle-options" | "beforeLoad")[], string, {
            focus: boolean;
            minLines: number;
            maxLines: number;
            readOnly: boolean;
            highlightActiveLine: boolean;
            tabSize: number;
            enableBasicAutocompletion: boolean | unknown[];
            enableLiveAutocompletion: boolean | unknown[];
            value: string;
            mode: string;
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
            scrollMargin: unknown[];
            wrapEnabled: boolean;
            navigateToFileEnd: boolean;
            placeholder: string;
            preventPasteOther: boolean;
        }>;
        $forceUpdate: ReactiveEffect<any>;
        $nextTick: typeof nextTick;
        $watch(source: string | Function, cb: Function, options?: WatchOptions<boolean> | undefined): WatchStopHandle;
    } & Readonly<{
        focus: boolean;
        minLines: number;
        maxLines: number;
        readOnly: boolean;
        highlightActiveLine: boolean;
        tabSize: number;
        enableBasicAutocompletion: boolean | unknown[];
        enableLiveAutocompletion: boolean | unknown[];
        value: string;
        mode: string;
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
        scrollMargin: unknown[];
        wrapEnabled: boolean;
        navigateToFileEnd: boolean;
        placeholder: string;
        preventPasteOther: boolean;
    } & {
        markers?: marker[] | undefined;
        debounceChangePeriod?: number | undefined;
        annotations?: Annotation[] | undefined;
        keyboardHandler?: string | undefined;
        commands?: unknown[] | undefined;
    }> & ShallowUnwrapRef<{
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
        isShowLock: Ref<boolean>;
        preserveds: Ref<string[]>;
        preservedAnchors: Ref<Range[]>;
        parseLock: () => void;
        showLock: () => void;
        splicePreserveds: () => string;
        affectPreserved: () => void;
        protectPreservedBoundary: (evt: KeyboardEvent) => void;
        protectInternal: () => void;
        plugins: Ref<("hide" | "blank" | "lock")[]>;
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
    }> & {} & {} & ComponentCustomProperties) | undefined>;
    source: Ref<string>;
    annotations: {
        row: number;
        column: number;
        type: string;
        text: string;
    }[];
    markers: {
        startRow: number;
        startCol: number;
        endRow: number;
        endCol: number;
        className: string;
        type: string;
    }[];
    blockText: Ref<string>;
    pos: Ref<string>;
    Editor: DefineComponent<{
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
            default(): {};
        };
        setOptions: {
            type: ObjectConstructor;
            default(): {};
        };
        scrollMargin: {
            type: ArrayConstructor;
            default(): number[];
        };
        annotations: {
            type: PropType<Annotation[]>;
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
            type: (BooleanConstructor | ArrayConstructor)[];
            default: boolean;
        };
        enableLiveAutocompletion: {
            type: (BooleanConstructor | ArrayConstructor)[];
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
        isShowLock: Ref<boolean>;
        preserveds: Ref<string[]>;
        preservedAnchors: Ref<Range[]>;
        parseLock: () => void;
        showLock: () => void;
        splicePreserveds: () => string;
        affectPreserved: () => void;
        protectPreservedBoundary: (evt: KeyboardEvent) => void;
        protectInternal: () => void;
        plugins: Ref<("hide" | "blank" | "lock")[]>;
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
    }, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("copy" | "input" | "blur" | "change" | "focus" | "scroll" | "paste" | "selection-change" | "cursor-change" | "handle-options" | "beforeLoad")[], "copy" | "input" | "blur" | "change" | "focus" | "scroll" | "paste" | "selection-change" | "cursor-change" | "handle-options" | "beforeLoad", VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<{
        focus: boolean;
        minLines: number;
        maxLines: number;
        readOnly: boolean;
        highlightActiveLine: boolean;
        tabSize: number;
        enableBasicAutocompletion: boolean | unknown[];
        enableLiveAutocompletion: boolean | unknown[];
        value: string;
        mode: string;
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
        scrollMargin: unknown[];
        wrapEnabled: boolean;
        navigateToFileEnd: boolean;
        placeholder: string;
        preventPasteOther: boolean;
    } & {
        markers?: marker[] | undefined;
        debounceChangePeriod?: number | undefined;
        annotations?: Annotation[] | undefined;
        keyboardHandler?: string | undefined;
        commands?: unknown[] | undefined;
    }>, {
        focus: boolean;
        minLines: number;
        maxLines: number;
        readOnly: boolean;
        highlightActiveLine: boolean;
        tabSize: number;
        enableBasicAutocompletion: boolean | unknown[];
        enableLiveAutocompletion: boolean | unknown[];
        value: string;
        mode: string;
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
        scrollMargin: unknown[];
        wrapEnabled: boolean;
        navigateToFileEnd: boolean;
        placeholder: string;
        preventPasteOther: boolean;
    }>;
    fontSizeA: () => void;
    fontSizeM: () => void;
    handleEditorChange: (val: string) => void;
    getValue: () => void;
    resetValue: () => void;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, EmitsOptions, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<{} & {}>, {}>;
export default _default;
