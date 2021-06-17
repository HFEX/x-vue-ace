import { onMounted, ref } from "vue";

export default function getSidRef() {
  const sid = ref("");
  onMounted(() => {
    sid.value = Math.random().toString().slice(2);
  });
  return { sid };
}
