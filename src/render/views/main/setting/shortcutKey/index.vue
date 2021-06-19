<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="打开应用">
      <el-button type="primary" size="small" plain title="设置应用的打开快捷键" @click="openKeyDialog('open')">
        {{ getters.shortcutKey.open }}
      </el-button>
    </el-form-item>
  </el-form>

  <Key-Dialog
    v-model:visible="state.showDialog"
    :type="state.keyType"
    :shortcutKey="getters.shortcutKey"
    @close="close"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { state, openKeyDialog, close } from './hook';
import { useStore } from 'vuex';
import KeyDialog from './component/keyDialog/index.vue';

export default defineComponent({
  components: {
    KeyDialog
  },
  setup() {
    const store = useStore();

    return {
      state,
      getters: store.getters,
      openKeyDialog,
      close
    };
  }
});
</script>

<style lang="less" scoped></style>
