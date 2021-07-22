import * as ace from "ace-builds";
import { onMounted, toRef, watch } from "vue";

import { Props } from "../types/props";

// const { FilteredList } = ace.require("ace/autocomplete");

// if (typeof FilteredList.prototype.filterCompletions === "function") {
//   const oldFilterCompletions = FilteredList.prototype.filterCompletions;
//   FilteredList.prototype.filterCompletions = function filterCompletions(
//     items: any[],
//     needle: unknown
//   ) {
//     const oldItems = items.map((item) => ({
//       ...item,
//       oldValue: item.value,
//       value: item.value.replace(/[()]/g, ""),
//     }));
//     const result = oldFilterCompletions.call(this, oldItems, needle).map((item: any) => ({
//       ...item,
//       value: item.oldValue,
//     }));
//     return result;
//   };
// }
export interface Completer {
  getCompletions: (
    _editor: unknown,
    _session: unknown,
    _pos: unknown,
    prefix: string,
    callback: (
      arg0: null,
      arg1: { caption: string; meta: string; value: string; score: number }[]
    ) => unknown
  ) => unknown;
}
export function watchCompleters(
  editor: {
    value: ace.Ace.Editor;
  },
  props: Props
) {
  onMounted(() => {
    watch(
      toRef(props, "completer"),
      (newVal) => {
        if (newVal) {
          console.info(newVal);
          editor.value.completers = [newVal];
        }
      },
      { immediate: true }
    );
  });
}
