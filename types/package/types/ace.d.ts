import ace from "ace-builds";
declare module "ace-builds" {
    namespace Ace {
        interface EditorOptions {
            enableBasicAutocompletion: boolean;
            enableLiveAutocompletion: boolean;
            enableSnippets: boolean;
        }
        interface Editor {
            /**
             * Get rid of console warning by setting this to Infinity
             **/
            $blockScrolling: number;
        }
        interface VirtualRenderer {
            scroller: HTMLElement;
            placeholderNode?: HTMLElement;
        }
        interface EditSession {
            doc: ace.Ace.Document;
            on(name: "changeAnnotation", callback: (...arg: any[]) => void): void;
        }
    }
}
