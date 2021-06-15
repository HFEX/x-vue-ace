import type { Ref, WritableComputedRef } from 'vue';
import type { Props } from "./types/props";
export default function getReadOnlyRef(props: Props): {
    lisReadOnly: Ref<boolean>;
    isReadOnly: WritableComputedRef<boolean>;
};
