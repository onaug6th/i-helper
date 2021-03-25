<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="打开应用">
      <el-button type="primary" size="small" plain title="设置应用的打开快捷键" @click="openKeyDialog('open')">
        {{ shortcutKey.open }}
      </el-button>
    </el-form-item>
  </el-form>

  <KeyDialog
    v-model:visible="showDialog"
    :type="state.keyDialogType"
    :shortcutKey="shortcutKey"
    @confirm="confirm"
    @close="close"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import KeyDialog from './component/keyDialog/index.vue';
import { showDialog, state, openKeyDialog, confirm, close } from './hook';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
    KeyDialog
  },
  setup() {
    const store = useStore();
    const {
      setting: { shortcutKey }
    } = store.getters;

    return {
      shortcutKey,
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
