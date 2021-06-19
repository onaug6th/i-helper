<template>
  <div>
    {{ state.setting }}
    <el-form label-width="100px">
      <el-form-item label="开机启动">
        <el-switch v-model="state.setting.openAtLogin" @change="updateSetting($event, 'openAtLogin')"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  setup() {
    const { proxy }: any = getCurrentInstance();
    const { setting } = useStore().getters;

    const state = reactive({
      setting
    });

    /**
     * 更新设置
     * @param val
     * @param type
     */
    async function updateSetting(val: any, type: string): Promise<void> {
      await proxy.$ipcClient('setting-update', {
        type,
        val
      });
    }

    return {
      updateSetting,
      state
    };
  }
});
</script>

<style lang="less" scoped></style>
