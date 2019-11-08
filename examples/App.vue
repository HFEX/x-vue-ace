<template>
  <div class="app">
    <Editor
      class="editor"
      mode="python"
      theme="chrome"
      enableLiveAutocompletion
      :fontSize="17"
      :value="source"
      :annotations="annotations"
      :markers="markers"
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
      source: 'print(233333333030303030033);\nprint(233333333030303030033);',
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

<style>
.error-marker {
  position: absolute;
  background-color: red;
}
</style>
