import { Editor } from "brace";
import { Ref } from "vue";

interface Params {
  affectPreserved: () => void,
  affectBlank: () => void,
  showLock: () => void,
  editor: Ref<Editor>,
  plugins: Ref<string[]>,
}
export default function getFormatfunction({
  affectPreserved,
  affectBlank,
  editor,
  plugins,
  showLock
}: Params) {
  return function format() {
    if (plugins.value.length > 0) {
      for (let idx = plugins.value.length - 1; idx >= 0; idx -= 1) {
        switch (plugins.value[idx]) {
          case 'lock':
            affectPreserved();
            break;
          case 'blank':
            affectBlank();
            break;
          default:
        }
      }
    }
    editor.value.getSession().selection.on('changeCursor', showLock);
  }
}
