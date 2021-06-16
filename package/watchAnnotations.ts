import AceAjax from "brace";
import { getCurrentInstance, onMounted, Ref, toRef, watch } from "vue";
import type { Props } from "./types/props";
import type {Editor} from 'brace';
export default function watchAnnotations(editor:{value:Editor},props:Props) {
  onMounted(() => {
    watch(toRef(props, 'annotations'), (newValue) => {
      editor.value.getSession().setAnnotations(newValue || []);
    }, { immediate: true });
    editor.value
    .getSession()
      .on('changeAnnotation', () => {
        const annotations = editor.value.getSession().getAnnotations();
        getCurrentInstance()?.emit('validate', annotations);
    });
  })
}
