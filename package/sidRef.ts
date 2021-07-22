import { onMounted, ref } from "vue";

export default function getSidRef() {
  const sid = ref("");
  const genSid = () => {
    sid.value = Math.random().toString().slice(2);
  };
  onMounted(genSid);
  return { sid, genSid };
}
