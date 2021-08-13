import type { Ref } from 'vue';
/**
 * 获取随机id用于阻止跨编辑器复制
 */
export default function getSidRef(): {
    sid: Ref<string>;
    genSid: () => void;
};
