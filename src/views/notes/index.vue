<template>
  <div class="notes">
    <div class="notes-header">
      <el-button type="primary" size="mini" @click="addNote">新增</el-button>
    </div>
    <el-card
      v-for="(note, noteIndex) in state.notes"
      class="note-item"
      shadow="hover"
      :key="noteIndex"
      @click="openNote(note.uid)"
      @contextmenu.prevent="contextMenu($event, note, noteIndex)"
    >
      <div>
        <div class="note-item__content" v-html="note.content || '新便笺'"></div>
        <div class="note-item__date">{{ dayjs(note.updatedAt).format('YYYY-MM-DD hh:mm:ss') }}</div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ipcRenderer } from 'electron';
import { uuid } from '@/utils';
import dayjs from 'dayjs';
//  便笺数据库
import notesDB from '@/dataBase/note';
import RightMenu from '@/components/rightMenu/src/rightMenu';

export default defineComponent({
  setup() {
    const routeName = ref(useRoute().name);

    const state: {
      notes: Array<any>;
    } = reactive({
      notes: []
    });

    /**
     * 获取便笺列表
     */
    async function getAllNotes() {
      notesDB._db
        ?.find({})
        .sort({ updatedAt: -1 })
        .exec((e, d) => {
          state.notes = d as DBNotes[];
        });
    }

    /**
     * 新增便笺
     */
    function addNote() {
      const uid = uuid();
      notesDB
        .insert({
          uid,
          content: '',
          className: ''
        })
        .then(res => {
          state.notes.unshift(res);
          openNote(uid);
        });
    }

    /**
     * 打开便笺
     * @param uid
     */
    function openNote(uid: string) {
      ipcRenderer.send('browser-window-open', { type: 'note', params: [uid] });
    }

    /**
     * 从列表中移除便笺
     * @param noteIndex
     */
    function delateNoteFormList(noteIndex: number) {
      state.notes.splice(noteIndex, 1);
    }

    /**
     * 删除便笺
     * @param note
     * @param noteIndex
     */
    function deleteNote(note, noteIndex: number) {
      //  通知主进程关闭便笺的窗口
      ipcRenderer.send(`browser-window-close-${note.uid}`);
      delateNoteFormList(noteIndex);
      notesDB.remove({
        uid: note.uid
      });
    }

    /**
     * 右键菜单
     * @param event
     * @param note
     * @param noteIndex
     */
    function contextMenu(event: MouseEvent, note, noteIndex: number) {
      RightMenu({
        event,
        list: [
          {
            text: '打开便笺',
            handler() {
              openNote(note.uid);
            }
          },
          {
            text: '删除便笺',
            handler() {
              deleteNote(note, noteIndex);
            }
          }
        ]
      });
    }

    function onIpcEvent() {
      ipcRenderer.on('notes-note-update', (event, { uid, content }) => {
        state.notes.some(note => {
          if (note.uid === uid) {
            note.content = content;
            return true;
          }
        });
      });

      ipcRenderer.on('notes-note-delete', (event, { uid }) => {
        const index = state.notes.findIndex(note => note.uid === uid);
        delateNoteFormList(index);
      });
    }

    onBeforeMount(() => {
      getAllNotes();
      onIpcEvent();
    });

    return {
      state,
      routeName,
      addNote,
      openNote,
      dayjs,
      contextMenu
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
