<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="版本信息">
        <el-button size="small" title="检查更新" @click="checkLatestVersion">{{ state.version }}</el-button>
      </el-form-item>

      <el-form-item label="iHelper官网">
        <el-button size="small" @click="openHomePage">查看官网</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  name: 'about',
  setup() {
    const { proxy }: any = getCurrentInstance();
    const { version } = useStore().getters;

    const state = reactive({
      version
    });

    /**
     * 更新设置
     * @param val
     * @param type
     */
    async function checkLatestVersion() {
      const { canUpdate } = await proxy.$ipcClientLoading('update-check-release');

      if (!canUpdate) {
        proxy.$notify({
          type: 'success',
          message: '当前已经是最新版本了'
        });
      }
    }

    function openHomePage() {
      proxy.$ipcClientLoading('update-open-homePage');
    }

    return {
      checkLatestVersion,
      openHomePage,
      state
    };
  }
});
</script>

<style lang="less" scoped></style>
