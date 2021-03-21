<template>
  <div>
    <el-form :model="form" label-width="100px">
      <el-form-item label="开机启动">
        <el-switch v-model="form.startAtBoot"></el-switch>
      </el-form-item>

      <el-form-item label="开发者命令">
        <el-input type="textarea" v-model="form.code"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  setup() {
    const form = reactive({
      startAtBoot: true,
      code: ''
    });

    return {
      form
    };
  }
});
</script>

<style lang="less" scoped></style>
