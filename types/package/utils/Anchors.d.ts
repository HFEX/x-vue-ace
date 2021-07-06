import ace from "ace-builds";
import { Ref } from "vue";
export declare function produceAnchors(type: string, arr: string[], editor: ace.Ace.Editor): ace.Ace.Range[];
export declare function clearAnchors(type: string, editor: ace.Ace.Editor, ...arrs: Array<Ref<Array<unknown>>>): void;
