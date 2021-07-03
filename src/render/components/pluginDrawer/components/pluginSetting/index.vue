<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="快速启动">
        <el-button type="primary" size="small" plain title="设置插件的启动快捷键" @click="openKeyDialog">
          {{ quickStart }}
        </el-button>
      </el-form-item>

      <el-form-item label="插件数据">
        1da2a2-sd12f-2asdf-fasdf
      </el-form-item>
    </el-form>
  </div>

  <Key-Dialog
    v-model:visible="state.showDialog"
    :shortcutKey="shortcutKey"
    :keyType="state.keyType"
    @confirm="confirm"
    @close="close"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import KeyDialog from '@/render/components/keyDialog/index.vue';
import useHook from './hook';

export default defineComponent({
  name: 'pluginSetting',
  components: {
    KeyDialog
  },
  props: {
    plugin: Object
  },
  setup(props) {
    const store = useStore();

    const shortcutKey = computed(() => {
      return store.getters.shortcutKey;
    });

    const { state, quickStart, openKeyDialog } = useHook({ shortcutKey, plugin: props.plugin });

    return {
      state,
      shortcutKey,
      quickStart,
      openKeyDialog
    };
  }
});
</script>

<style lang="less" scoped></style>
