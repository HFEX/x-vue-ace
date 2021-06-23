<template>
  <div class="app">
    <div class="app-head"></div>
    <div class="app-wrapper">
      <div class="app-wrapper-left"></div>
      <div class="app-wrapper-center">
        <Editor
          ref="editor"
          class="editor"
          mode="python"
          theme="chrome"
          enable-live-autocompletion
          prevent-paste-other
          focus
          :markup="enableMarkup"
          :remove-mark="removeMark"
          :font-size="fontSize"
          :value="source"
          :annotations="annotations"
          :markers="markers"
          @change="handleEditorChange"
        />
      </div>
      <div class="app-wrapper-right"></div>
    </div>
    <div class="tools">
      <textarea v-model="blockText" /><br />
      <input v-model="pos" /><br />
      <button @click="handleInsert">insert</button>
      <button @click="toggleMarkup">toggleMarkup</button>
      <button @click="fontSizeA">fontSize+</button>
      <button @click="fontSizeM">fontSize-</button>
      <button @click="getValue">getValue</button>
      <button @click="resetValue">resetValue</button>
      <button @click="handleRemoveMark">handleRemoveMark</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

import Editor from "../package/index";
export default defineComponent({
  components: {
    Editor,
  },
  setup: () => {
    const source = ref(`# 输入
num = int(input("共有多少只乌龟："))
# 第一次数1只
step =  <xiaohou-blank></xiaohou-blank>
# 模拟
turtles = []
for i in range(num):
    turtles.append(<xiaohou-blank></xiaohou-blank>)
    index = 0
    for i in range(num - <xiaohou-blank></xiaohou-blank>):
      # 算出要被淘汰的乌龟编号：（当前编号+步长-1）对乌龟数量取余数
      index = (index+step-1)%len(turtles)
      # 使用pop函数淘汰第index只乌龟
      turtles.pop(<xiaohou-blank></xiaohou-blank>)
      # 每次数的数量是上一次的2倍
      step*=2
print("赢家是 %d 号乌龟！" % turtles[0])`);

    const annotations = reactive([
      {
        row: 0,
        column: 2,
        type: "error",
        text: "Some error.",
      },
    ]);
    const fontSize = ref(20);
    const markers = reactive([
      {
        startRow: 0,
        startCol: 0,
        endRow: 0,
        endCol: 5,
        className: "error-marker",
        type: "background",
      },
    ]);
    const blockText = ref("");
    const pos = ref("1,3,5");
    const enableMarkup = ref(true);
    const removeMark = ref(false);
    const editorRef = ref<InstanceType<typeof Editor>>();

    const handleInsert = () => {
      editorRef.value?.insertAndSelect(blockText.value, pos.value);
      // this.blockText = '';
    };

    const toggleMarkup = () => {
      enableMarkup.value = !enableMarkup.value;
      console.log(enableMarkup.value);
    };
    const fontSizeA = () => {
      fontSize.value += 1;
    };
    const fontSizeM = () => {
      fontSize.value -= 1;
    };

    const handleRemoveMark = () => {
      removeMark.value = !removeMark.value;
      console.log(removeMark.value);
    };

    const handleEditorChange = (val: string) => {
      // this.source = val;
      console.log(val);
    };

    const getValue = () => {
      console.log(editorRef.value?.getValue());
    };

    const resetValue = () => {
      source.value = "";
    };
    return {
      handleInsert,
      handleRemoveMark,
      toggleMarkup,
      fontSize,
      enableMarkup,
      removeMark,
      editorRef,
      source,
      annotations,
      markers,
      blockText,
      pos,
      Editor,
      fontSizeA,
      fontSizeM,
      handleEditorChange,
      getValue,
      resetValue,
    };
  },
});
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.app {
  width: 100%;
  min-width: 1024px;
  height: 100%;
  min-height: 560px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  overflow: hidden;
  &-head {
    position: relative;
    padding: 8px;
    height: 48px;
    line-height: 32px;
    background-color: #37261f;
  }
  &-wrapper {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    min-height: 1%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    &-left {
      position: relative;
      z-index: 10;
      width: 0px;
      height: 100%;
      background-color: #8cac4b;
      border: 1px solid #6da00a;
      -webkit-box-shadow: 2px 0 6px #b8b5ad;
      box-shadow: 2px 0 6px #b8b5ad;
    }
    &-center {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      min-height: 1%;
      min-width: 10px;
    }
    &-right {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      width: 400px;
      height: 100%;
      background-color: #fdf7e7;
      border-left: 1px solid #87746d;
    }
  }
}
.editor {
  position: relative;
  width: 100%;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  min-height: 1%;
}

.app {
  position: relative;
}

.tools {
  position: absolute;
  top: 0;
  right: 0;
  width: 240px;
  background-color: #f0f0f0;

  textarea {
    box-sizing: border-box;
    width: 100%;
    height: 90px;
  }
}
</style>

<style>
.error-marker {
  position: absolute;
  background-color: red;
}
</style>
