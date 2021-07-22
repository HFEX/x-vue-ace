import * as ace from "ace-builds/";
import { Props } from "../types/props";
export interface Completer {
    getCompletions: (_editor: unknown, _session: unknown, _pos: unknown, prefix: string, callback: (arg0: null, arg1: {
        caption: string;
        meta: string;
        value: string;
        score: number;
    }[]) => unknown) => unknown;
}
export declare function watchCompleters(editor: ace.Ace.Editor, props: Props): void;
