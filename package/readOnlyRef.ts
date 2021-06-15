import { computed, ref } from "vue";
import type { Props } from "./types/props";

export default function getReadOnlyRef(props: Props) {
  const lisReadOnly = ref(false)
  const isReadOnly = computed({
    get():boolean {
      return props.readOnly|| lisReadOnly.value
    },
    set(newValue:boolean):void {
      lisReadOnly.value = newValue
    }
  })
  return {
    lisReadOnly,
    isReadOnly
  }
}
