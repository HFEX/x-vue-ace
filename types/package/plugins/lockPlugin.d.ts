import { Editor, Range } from 'brace';
import { Ref } from 'vue';
interface params {
    editor: {
        value: Editor;
    };
    editorValue: Ref<string>;
    plugins: Ref<Array<string>>;
    isReadOnly: Ref<boolean>;
}
export declare function useLockPlugin({ editor, editorValue, plugins, isReadOnly }: params): LockPlugin;
export interface LockPlugin {
    isShowLock: Ref<boolean>;
    preserveds: Ref<string[]>;
    preservedAnchors: Ref<Range[]>;
    parseLock: () => void;
    showLock: () => void;
    splicePreserveds: () => string;
    affectPreserved: () => void;
    protectPreservedBoundary: (evt: KeyboardEvent) => void;
    protectInternal: () => void;
}
export {};
