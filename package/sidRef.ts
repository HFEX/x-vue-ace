import { onMounted, ref } from "vue";
/**
 * 获取随机id用于阻止跨编辑器复制
 */
export default function getSidRef() {
  const sid = ref("");
  const genSid = () => {
    sid.value = Math.random().toString().slice(2);
  };
  onMounted(genSid);
  return { sid, genSid };
}
