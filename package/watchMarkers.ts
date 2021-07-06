import ace from "ace-builds";
import { onMounted, toRef, watch } from "vue";

import type { Props } from "./types/props";
const Range = ace.require("ace/range").Range;
export default function watchMarkers(editor: { value: ace.Ace.Editor }, props: Props) {
  // remove foreground markers
  onMounted(() => {
    watch(
      toRef(props, "markers"),
      (markers) => {
        let currentMarkers = editor.value.getSession().getMarkers(true);
        for (const markerkey in currentMarkers) {
          if (Object.prototype.hasOwnProperty.call(currentMarkers, markerkey)) {
            editor.value.getSession().removeMarker(currentMarkers[markerkey].id);
          }
        }

        currentMarkers = editor.value.getSession().getMarkers(false);
        for (const markerkey in currentMarkers) {
          if (Object.prototype.hasOwnProperty.call(currentMarkers, markerkey)) {
            const currentMarker = currentMarkers[markerkey];
            const { clazz } = currentMarker;
            if (
              clazz !== "ace_active-line" &&
              clazz !== "ace_selected-word" &&
              clazz !== "preserved-highlight" &&
              clazz !== "blank-highlight"
            ) {
              editor.value.getSession().removeMarker(currentMarker.id);
            }
          }
        }

        markers?.forEach(
          ({ startRow, startCol, endRow, endCol, className, type, inFront = false }) => {
            const range = new Range(startRow, startCol, endRow, endCol);
            editor.value.getSession().addMarker(range, className, type, inFront);
          }
        );
      },
      { immediate: true }
    );
  });
}
