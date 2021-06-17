import ace from 'brace';
import { Ref } from "vue";
import type { LockPlugin } from './plugins/lockPlugin';
import type { HideCodePlugin } from './plugins/hidePlugin';
import type { BlankPlugin } from './plugins/blankPlugin';
interface params {
    editor: {
        value: ace.Editor;
    };
    editorValue: Ref<string>;
    isReadOnly: Ref<boolean>;
}
export declare function usePluginsRef({ editor, editorValue, isReadOnly }: params): {
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
    preservedAnchors: Ref<ace.Range[]>;
    parseLock: () => void;
    showLock: () => void;
    splicePreserveds: () => string;
    affectPreserved: () => void;
    protectPreservedBoundary: (evt: KeyboardEvent) => void;
    protectInternal: () => void;
    plugins: Ref<("hide" | "blank" | "lock")[]>;
    clearPlugins: () => void;
};
export interface Plugins extends LockPlugin, HideCodePlugin, BlankPlugin {
    plugins: Ref<Array<'lock' | 'blank' | 'hide'>>;
    clearPlugins: () => void;
}
export {};
