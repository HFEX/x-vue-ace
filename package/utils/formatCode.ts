import ace from "ace-builds";
import { Ref } from "vue";

interface Params {
  affectPreserved: () => void;
  affectBlank: () => void;
  showLock: () => void;
  editor: { value: ace.Ace.Editor };
  plugins: Ref<string[]>;
}
export default function getFormatfunction({
  affectPreserved,
  affectBlank,
  editor,
  plugins,
  showLock,
}: Params) {
  return function format() {
    if (plugins.value.length > 0) {
      for (let idx = plugins.value.length - 1; idx >= 0; idx -= 1) {
        switch (plugins.value[idx]) {
          case "lock":
            affectPreserved();
            break;
          case "blank":
            affectBlank();
            break;
          default:
        }
      }
    }
    editor.value.getSession().selection.on("changeCursor", showLock);
  };
}
