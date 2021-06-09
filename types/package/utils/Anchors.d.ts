import * as ace from 'brace';
import { Ref } from 'vue';
export declare function produceAnchors(type: string, arr: Ref<Array<any>>, editor: ace.Editor): ace.Range[];
export declare function clearAnchors(type: string, editor: ace.Editor, ...arrs: Array<Ref<Array<any>>>): void;
