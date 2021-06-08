import { Ref, ref } from "vue";

export function useHideCodePlugin(editorValue:Ref<string>,plugins:Ref<Array<string>>):HideCodePlugin {
  const startCode = ref(''); // 开头隐藏代码
  const endCode = ref('') // 结尾隐藏代码
  function clearHide() {
    startCode.value = '';
    endCode.value = '';
  }
  function parseHide() {
    const args = editorValue.value.match(/<xiaohou-hide>([^]+?)<\/xiaohou-hide>/igm) || [];
    const len = args.length;
    const fragment0 = args[0];
    const fragment1 = len > 1 ? args[len - 1] : undefined;
    if (fragment0 || fragment1) {
      if (fragment0 && editorValue.value.indexOf(fragment0) !== 0 && !fragment1) {
        endCode.value = fragment0;
      } else {
        startCode.value = fragment0 || '';
        endCode.value = fragment1 || '';
      }
      editorValue.value = editorValue.value.replace(startCode.value, '');
      editorValue.value = editorValue.value.replace(endCode.value, '');
      plugins.value.push('hide');
    }
  }
  return {
    startCode,
    endCode,
    clearHide,
    parseHide,
  }
}

export interface HideCodePlugin{
  startCode: Ref<string>,
  endCode: Ref<string>,
  clearHide: ()=>void,
  parseHide: ()=>void,
}
