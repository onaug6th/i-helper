<template>
  <el-form label-width="80px">
    <el-form-item label="打开应用">
      <el-button type="primary" size="small" plain title="设置应用的打开快捷键" @click="openKeyDialog('open')">
        {{ getters.shortcutKey.open || '暂未设置' }}
      </el-button>
    </el-form-item>
  </el-form>

  <Key-Dialog
    v-model:visible="state.showDialog"
    :keyType="state.keyType"
    :shortcutKey="getters.shortcutKey"
    :updateFn="updateFn"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import useHook from './hook';
import KeyDialog from '@/render/components/keyDialog/index.vue';

export default defineComponent({
  name: 'shortcutKey',
  components: {
    KeyDialog
  },
  setup() {
    const store = useStore();
    const { state, openKeyDialog, updateFn } = useHook(store);

    return {
      state,
      getters: store.getters,
      openKeyDialog,
      updateFn
    };
  }
});
</script>

<style lang="less" scoped></style>
