import brace from "brace";
declare module "brace" {
    interface Editor {
        completers: Completer[];
    }
    interface Completer {
        identifierRegexps?: Array<RegExp>;
        getCompletions(editor: brace.Editor, session: unknown, position: unknown, prefix: string, callback: unknown): void;
    }
}
