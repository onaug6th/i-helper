<template>
  <div
    v-html="editorContent"
    ref="editor"
    class="editor"
    contenteditable
    spellcheck="false"
    :class="className"
    @paste.prevent="paste"
    @input="contentChange"
  ></div>
  <section class="editor-tools">
    <template v-for="item in icons" :key="item.name">
      <button class="icon" :title="item.title" @click="editorIconHandle($event, item.name)">
        <i class="iconfont" :class="item.icon"></i>
      </button>
    </template>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from 'vue';
import * as utils from '@/utils';

export default defineComponent({
  props: {
    content: String,
    className: String
  },
  emits: ['on-input'],
  setup(props, { emit }) {
    //  编辑器
    const editor: Ref<HTMLDivElement | null> = ref(null);
    const icons = [
      {
        name: 'bold',
        title: '加粗'
      },
      {
        name: 'italic',
        title: '斜体'
      },
      {
        name: 'underline',
        title: '下划线'
      },
      {
        name: 'strikethrough',
        title: '删除线'
      },
      {
        name: 'insertUnorderedList',
        title: '无序列表'
      },
      {
        name: 'insertOrderedList',
        title: '有序列表'
      }
    ];
    const editorContent: Ref<string | undefined> = ref('');

    watch(props, props => {
      if (!editorContent.value) {
        editorContent.value = props.content;
      }
    });

    onMounted(() => {
      focus();
    });

    /**
     * 聚焦编辑器
     */
    function focus() {
      const range = document.createRange();
      range.selectNodeContents(editor.value as HTMLDivElement);
      range.collapse(false);
      const selecton = window.getSelection() as Selection;
      selecton.removeAllRanges();
      selecton.addRange(range);
    };

    /**
     * 按钮点击事件处理
     * @param e
     * @param name
     */
    function editorIconHandle (e: Event, name: string) {
      e.preventDefault();
      document.execCommand(name, false);
    };

    /**
     * 内容改变回调
     * @param e
     */
    const contentChange = utils.debounce((e: InputEvent) => {
      const editorHtml = (e.target as Element).innerHTML;
      emit('on-input', editorHtml);
    }, 500);

    /**
     * 粘贴回调
     * @param e
     */
    function paste (e: ClipboardEvent) {
      const pasteText = e.clipboardData?.getData('text/plain');
      document.execCommand('insertText', false, pasteText);
    };

    return {
      editor,
      editorIconHandle,
      icons,
      contentChange,
      paste,
      editorContent
    };
  }
});
</script>

<style lang="less" scoped>
.editor {
  width: 100%;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  outline: none;
  font-size: 14px;
  line-height: 1.8;
  overflow-y: auto;
  overflow-x: hidden;
  * {
    font-size: 14px;
    line-height: 1.8;
    word-break: break-all;
  }
  div {
    max-width: 100%;
    overflow-x: auto;
    word-break: break-all;
  }
  span {
    max-width: 100%;
    word-break: break-all;
  }
}

.editor-tools {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 35px;
  background-color: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.03);
}
</style>
