<template>
  <div class="editor-wrap">
    <el-scrollbar>
      <div
        v-html="editorContent"
        ref="editor"
        class="editor"
        contenteditable
        :class="className"
        @paste.prevent="paste"
        @input="contentChange"
      ></div>
    </el-scrollbar>
  </div>
  <section class="tools">
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
  emits: ['change'],
  setup(props, { emit }) {
    //  编辑器
    const editor: Ref<HTMLDivElement | null> = ref(null);
    const icons = [
      {
        name: 'bold',
        title: '加粗',
        icon: 'icon-editor-bold'
      },
      {
        name: 'italic',
        title: '斜体',
        icon: 'icon-italic'
      },
      {
        name: 'underline',
        title: '下划线',
        icon: 'icon-underline'
      },
      {
        name: 'strikethrough',
        title: '删除线',
        icon: 'icon-strikethrough'
      },
      {
        name: 'insertUnorderedList',
        title: '无序列表',
        icon: 'icon-ul'
      },
      {
        name: 'insertOrderedList',
        title: '有序列表',
        icon: 'icon-ol'
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
    }

    /**
     * 按钮点击事件处理
     * @param e
     * @param name
     */
    function editorIconHandle(e: Event, name: string) {
      e.preventDefault();
      document.execCommand(name, false);
    }

    /**
     * 内容改变回调
     * @param e
     */
    const contentChange = utils.debounce((e: InputEvent) => {
      const editorHtml = (e.target as Element).innerHTML;
      emit('change', editorHtml);
    }, 1000);

    /**
     * 粘贴回调
     * @param e
     */
    function paste(e: ClipboardEvent) {
      const pasteText = e.clipboardData?.getData('text/plain');
      document.execCommand('insertText', false, pasteText);
    }

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
@import './index.less';
</style>
