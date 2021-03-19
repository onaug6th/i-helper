<template>
  <Header :beforeClose="close" />
  <Editor :content="editContent" @change="changeEditContent" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import Header from '@render/components/header/index.vue';
import Editor from './components/editor/index.vue';
import { useRoute } from 'vue-router';
import { ipcRenderer, remote } from 'electron';
//  便笺数据库
import notesDB from '@/main/dataBase/notes';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
    Header,
    Editor
  },
  setup() {
    let uid: string;
    const editContent = ref('');
    const route = useRoute();
    const store = useStore();
    const { windowId, mainWindowId } = store.getters;

    onBeforeMount(() => {
      initEditorContent();
      remote.ipcMain.once(`browser-window-close-${uid}`, () => {
        ipcRenderer.send('browser-window-close', windowId);
      });
    });

    /**
     * 生成编辑器内容
     */
    function initEditorContent() {
      const routeUid = route.query.uid as string;
      if (routeUid) {
        uid = routeUid;
        getCurUidItem(routeUid);
      } else {
        alert('不存在此便笺');
      }
    }

    /**
     * 获取当前便笺内容
     * @param uid
     */
    async function getCurUidItem(uid: string) {
      const info = (await notesDB.findOne({ uid })) as DBNotes;
      if (!info) return;
      editContent.value = info.content;
    }

    /**
     * 更新便笺内容
     * @param content 内容
     */
    function changeEditContent(content: string) {
      editContent.value = content;
      if (!uid) return false;
      notesDB
        .update(
          {
            uid
          },
          {
            uid,
            content
          }
        )
        .then(() => {
          //  通知主面板更新便笺内容
          ipcRenderer.send('browser-window-communication', {
            windowId: mainWindowId,
            params: {
              uid,
              content
            },
            eventName: 'notes-note-update'
          });
        });
    }

    /**
     * 关闭便笺
     */
    async function close() {
      if (!editContent.value) {
        //  如果内容为空就直接从数据库删除
        await notesDB.remove({
          uid
        });

        //  通知主面板更新便笺内容
        ipcRenderer.send('browser-window-communication', {
          windowId: mainWindowId,
          params: {
            uid
          },
          eventName: 'notes-note-delete'
        });
      }
    }

    return {
      editContent,
      changeEditContent,
      close
    };
  }
});
</script>

<style lang="less" scoped></style>
