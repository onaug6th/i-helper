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
import { defineComponent, onBeforeMount } from 'vue';
import KeyDialog from './component/keyDialog/index.vue';
import { showDialog, state, openKeyDialog, getShortcutKeys, confirm, close } from './hook';

export default defineComponent({
  components: {
    KeyDialog
  },
  setup() {
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
