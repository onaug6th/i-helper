<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="打开应用">
      <el-button type="primary" size="small" plain title="设置应用的打开快捷键" @click="openKeyDialog('open')">
        {{ state.shortcutKeys.open }}
      </el-button>
    </el-form-item>
  </el-form>

  <KeyDialog
    v-model:visible="showDialog"
    :type="state.keyDialogType"
    :shortcutKeys="state.shortcutKeys"
    @confirm="confirm"
    @close="close"
  />
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
      shortcutKeys: {},
      keyDialogType: ''
    });

    /**
     * 获取快捷键配置
     */
    function getShortcutKeys() {
      ipcRenderer.invoke('shortcutKey-get').then(result => {
        state.shortcutKeys = result;
      });
    }

    /**
     * 打开按键设置弹窗
     */
    function openKeyDialog(type) {
      showDialog.value = true;
      state.keyDialogType = type;
    }

    /**
     * 确认
     */
    function confirm() {
      getShortcutKeys();
      close();
    }

    /**
     * 关闭
     */
    function close() {
      showDialog.value = false;
    }

    onBeforeMount(() => {
      getShortcutKeys();
    });

    return {
      showDialog,
      state,
      openKeyDialog,
      confirm,
      close
    };
  }
});
</script>

<style lang="less" scoped></style>
