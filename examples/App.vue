<template>
  <div class="app">
    <Editor
      class="editor"
      mode="python"
      theme="chrome"
      enableLiveAutocompletion
      :fontSize="17"
      :value="source"
      @change="handleEditorChange"
    />
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
      source: 'print(2)',
    };
  },

  methods: {
    handleEditorChange(val) {
      this.source = val;
    },
  },

  components: { Editor },
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
}

.app,
.editor {
  width: 100%;
  height: 100%;
}
</style>
