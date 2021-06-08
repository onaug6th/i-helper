<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="打开应用">
      <el-button
        type="primary"
        size="small"
        plain
        title="设置应用的打开快捷键"
        @click="openKeyDialog('open')"
        :disabled="true"
      >
        {{ getters.setting.shortcutKey.open }}
      </el-button>
    </el-form-item>
  </el-form>

  <Key-Dialog
    v-model:visible="showDialog"
    :type="state.keyDialogType"
    :shortcutKey="getters.setting.shortcutKey"
    @confirm="confirm"
    @close="close"
  />
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import KeyDialog from './component/keyDialog/index.vue';
import { showDialog, state, openKeyDialog, close } from './hook';
import { useStore } from 'vuex';

export default defineComponent({
  components: {
    KeyDialog
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const store = useStore();

    /**
     * 确认
     */
    function confirm() {
      store.dispatch('app/setNewestSetting');

      proxy.$notify({
        type: 'success',
        message: '设置成功'
      });
      close();
    }

    return {
      showDialog,
      state,
      getters: store.getters,
      openKeyDialog,
      confirm,
      close
    };
  }
});
</script>

<style lang="less" scoped></style>
