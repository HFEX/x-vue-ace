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
          enableLiveAutocompletion
          preventPasteOther
          focus
          :markup="enableMarkup"
          :removeMark="removeMark"
          :fontSize="fontSize"
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

<script>
import Editor from '../package/index';
import 'brace/theme/chrome';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/mode/python';

export default {
  name: 'app',

  data() {
    return {
      source: `# 输入
num = int(input("共有多少只乌龟："))
# 第一次数1只
step =          
# 模拟
turtles = []
for i in range(num):
    turtles.append(i)
index = 0
for i in range(num - 1):
    # 算出要被淘汰的乌龟编号：
              
    1234567890
    # 使用pop函数淘汰第index只乌龟
    turtles
    

    
    # 每次数的数量是上一次的2倍
    step  
print("赢家是 %d 号乌龟！" % turtles[0])`,
      annotations: [{
        row: 0,
        column: 2,
        type: 'error',
        text: 'Some error.',
      }],
      fontSize: 20,
      markers: [{
        startRow: 0,
        startCol: 0,
        endRow: 0,
        endCol: 5,
        className: 'error-marker',
        type: 'background',
      }],
      blockText: '',
      pos: '1,3,5',
      enableMarkup: true,
      removeMark: false,
    };
  },

  methods: {
    handleInsert() {
      this.$refs.editor.insertAndSelect(this.blockText, this.pos);
      // this.blockText = '';
    },

    toggleMarkup() {
      this.enableMarkup = !this.enableMarkup;
      console.log(this.enableMarkup);
    },

    fontSizeA() {
      this.fontSize += 1;
    },
    fontSizeM() {
      this.fontSize -= 1;
    },

    handleRemoveMark() {
      this.removeMark = !this.removeMark;
      console.log(this.removeMark);
    },

    handleEditorChange(val) {
      // this.source = val;
      console.log(val);
    },

    getValue() {
      console.log(this.$refs.editor.getValue());
    },

    resetValue() {
      this.source = '';
    },
  },

  components: { Editor },
};
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
