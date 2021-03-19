<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="打开应用">
      <el-button type="primary" size="small" plain title="设置应用的打开快捷键" @click="openKeyDialog">
        {{ state.shortKeyConfig.open }}
      </el-button>
    </el-form-item>
  </el-form>

  <KeyDialog v-model:visible="showDialog" :ipcMainEventName="ipcMainEventName" />
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { defineComponent, onBeforeMount, reactive, ref } from 'vue';
import KeyDialog from './component/keyDialog/index.vue';

export default defineComponent({
  components: {
    KeyDialog
  },
  setup() {
    let showDialog = ref(false);
    let state = reactive({
      shortKeyConfig: {}
    });

    function getShortcut() {
      ipcRenderer.invoke('shortcut-get').then(result => {
        state.shortKeyConfig = result;
      });
    }

    function openKeyDialog() {
      showDialog.value = true;
    }

    onBeforeMount(() => {
      getShortcut();
    });

    return {
      showDialog,
      state,
      ipcMainEventName: '',
      openKeyDialog
    };
  }
});
</script>

<style lang="less" scoped></style>
