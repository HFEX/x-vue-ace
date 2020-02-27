<template>
  <div class="app">
    <Editor
      ref="editor"
      class="editor"
      mode="python"
      theme="chrome"
      enableLiveAutocompletion
      preventPasteOther
      focus
      :fontSize="17"
      :value="source"
      :annotations="annotations"
      @change="handleEditorChange"
    />
    <div class="tools">
      <textarea v-model="blockText" /><br />
      <input v-model="pos" /><br />
      <button @click="handleInsert">insert</button>
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
      source: 'print(1234567890);',
      annotations: [{
        row: 0,
        column: 2,
        type: 'error',
        text: 'Some error.',
      }],
      markers: [{
        startRow: 0,
        startCol: 5,
        endRow: 0,
        endCol: 9,
        className: 'error-marker',
        type: 'background',
      }],
      blockText: '',
      pos: '1,3,5',
    };
  },

  methods: {
    handleInsert() {
      this.$refs.editor.insertAndSelect(this.blockText, this.pos);
      // this.blockText = '';
    },

    handleEditorChange(val) {
      this.source = val;
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

.app,
.editor {
  width: 100%;
  height: 100%;
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
