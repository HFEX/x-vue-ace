import ace from "ace-builds";
declare module "ace-builds" {
  namespace Ace {
    interface EditorOptions {
      enableBasicAutocompletion: boolean;
      enableLiveAutocompletion: Completer[] | boolean;
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
  // interface Editor {
  //   completers: Completer[];
  // }
  // interface Completer {
  //   identifierRegexps?: Array<RegExp>;
  //   getCompletions(
  //     editor: ace.Ace.Editor,
  //     session: unknown,
  //     position: unknown,
  //     prefix: string,
  //     callback: unknown
  //   ): void;
  // }
}
