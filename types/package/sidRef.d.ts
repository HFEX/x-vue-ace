import type { Ref } from 'vue';
export default function getSidRef(): {
    sid: Ref<string>;
    genSid: () => void;
};
