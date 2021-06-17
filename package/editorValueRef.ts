import { Ref, ref } from "vue";

import type { Props } from "./types/props";
interface params {
  getEditorValue: () => string;
  plugins: Ref<string[]>;
  splicePreserveds: () => string;
  spliceBlanks: () => string;
  startCode: Ref<string>;
  endCode: Ref<string>;
  [key: string]: any;
}
// 隐藏代码 -- 此处因需求只处理首尾代码隐藏需求
export default function getEditorValueRef(props: Readonly<Props>) {
  const editorValue = ref(props.value);
  const currValue = ref("");
  const isVaryCurrValue = ref(true);
  function getValueFunction({
    getEditorValue,
    spliceBlanks,
    splicePreserveds,
    plugins,
    startCode,
    endCode,
  }: params) {
    function getValue(notJudge = false) {
      if (isVaryCurrValue.value) {
        currValue.value = splitCode(notJudge);
        isVaryCurrValue.value = false;
      }
      return currValue.value;
    }
    function splitCode(notJudge: boolean) {
      let code = getEditorValue();

      if (props.markup || notJudge) {
        plugins.value.forEach((plugin) => {
          switch (plugin) {
            case "lock":
              code = splicePreserveds();
              break;
            case "blank":
              code = spliceBlanks();
              break;
            default:
          }
        });
        // if (this.startCode && !code.match(/^[\n\f\r]/)) {
        //   code = `\n${code}`;
        // }
        // if (this.endCode && !code.match(/[\n\f\r]$/)) {
        //   code += '\n';
        // }

        code = `${startCode.value}${code}${endCode.value}`;
      }

      return code;
    }
    return { getValue };
  }
  return {
    editorValue,
    isVaryCurrValue,
    currValue,
    getValueFunction,
  };
}
