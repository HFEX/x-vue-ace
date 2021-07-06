import {Ace} from "ace-builds";
import { Ref, ref } from "vue";

import type { BlankPlugin } from "./plugins/blankPlugin";
import { useBlankPlugin } from "./plugins/blankPlugin";
import type { HideCodePlugin } from "./plugins/hidePlugin";
import { useHideCodePlugin } from "./plugins/hidePlugin";
import type { LockPlugin } from "./plugins/lockPlugin";
import { useLockPlugin } from "./plugins/lockPlugin";
import { clearAnchors } from "./utils/Anchors";
interface params {
  editor: { value: Ace.Editor };
  editorValue: Ref<string>;
  isReadOnly: Ref<boolean>;
}
export function usePluginsRef({ editor, editorValue, isReadOnly }: params) {
  const plugins = ref<Array<"lock" | "blank" | "hide">>([]);
  const lockPlugin = useLockPlugin({ editor, editorValue, plugins, isReadOnly });
  const hidePlugin = useHideCodePlugin(editorValue, plugins);
  const blankPlugin = useBlankPlugin({
    editor,
    editorValue,
    plugins,
    isReadOnly,
    showLock: lockPlugin.showLock,
  });
  function clearPlugins() {
    if (plugins.value.length > 0) {
      for (let idx = plugins.value.length - 1; idx >= 0; idx -= 1) {
        switch (plugins.value[idx]) {
          case "blank":
            clearAnchors(
              "blank",
              editor.value,
              blankPlugin.blanks,
              blankPlugin.blankGaps,
              blankPlugin.blankAnchors
            );
            editor.value.getSession().selection.off("changeCursor", blankPlugin.protectExternal);
            break;
          case "lock":
            clearAnchors(
              "preserved",
              editor.value,
              lockPlugin.preservedAnchors,
              lockPlugin.preserveds
            );
            editor.value.getSession().selection.off("changeCursor", lockPlugin.protectInternal);
            break;
          case "hide":
            hidePlugin.clearHide();
            break;
          default:
        }
      }
      editor.value.getSession().selection.off("changeCursor", lockPlugin.showLock);
    }
    plugins.value = [];
  }
  return {
    plugins,
    clearPlugins,
    ...lockPlugin,
    ...hidePlugin,
    ...blankPlugin,
  };
}

export interface Plugins extends LockPlugin, HideCodePlugin, BlankPlugin {
  plugins: Ref<Array<"lock" | "blank" | "hide">>;
  clearPlugins: () => void;
}
