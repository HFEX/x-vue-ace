import { Ref } from 'vue';
import { Props } from './types/props';
interface params {
    getEditorValue: () => string;
    plugins: Ref<string[]>;
    splicePreserveds: () => string;
    spliceBlanks: () => string;
    startCode: Ref<string>;
    endCode: Ref<string>;
    [key: string]: any;
}
export default function getEditorValueRef(props: Readonly<Props>): {
    editorValue: Ref<string>;
    isVaryCurrValue: Ref<boolean>;
    currValue: Ref<string>;
    getValueFunction: ({ getEditorValue, spliceBlanks, splicePreserveds, plugins, startCode, endCode, }: params) => {
        getValue: (notJudge?: boolean) => string;
    };
};
export {};
