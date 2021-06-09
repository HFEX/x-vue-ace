import type { Ref, WritableComputedRef } from 'vue';
import { Props } from "./types/props";
export default function getReadOnlyRef(props: Props): {
    lisReadOnly: Ref<boolean>;
    isReadOnly: WritableComputedRef<boolean>;
};
