import type { Editor } from "brace";
import { getCurrentInstance, onMounted, toRef, watch } from "vue";

import type { Props } from "./types/props";
export default function watchAnnotations(editor: { value: Editor }, props: Props) {
  onMounted(() => {
    watch(
      toRef(props, "annotations"),
      (newValue) => {
        editor.value.getSession().setAnnotations(newValue || []);
      },
      { immediate: true }
    );
    editor.value.getSession().on("changeAnnotation", () => {
      const annotations = editor.value.getSession().getAnnotations();
      getCurrentInstance()?.emit("validate", annotations);
    });
  });
}
