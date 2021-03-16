<template>
  <el-form ref="form" label-width="80px">
    <el-form-item label="打开应用">
      <el-button type="primary" size="small" plain title="设置应用的打开快捷键" @click="openKeyDialog">
        {{ shortKey }}
      </el-button>
    </el-form-item>
  </el-form>

  <KeyDialog v-model="showDialog" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import KeyDialog from './component/keyDialog/index.vue';

export default defineComponent({
  components: {
    KeyDialog
  },
  setup() {
    let showDialog = ref(false);

    function openKeyDialog() {
      showDialog.value = true;
    }

    return {
      showDialog,
      shortKey: 'ctrl + space',
      openKeyDialog
    };
  }
});
</script>

<style lang="less" scoped></style>
