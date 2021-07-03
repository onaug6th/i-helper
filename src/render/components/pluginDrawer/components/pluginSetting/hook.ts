import { computed, reactive } from 'vue';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function({ shortcutKey, plugin }: any): any {
  const state = reactive({
    showDialog: false,
    keyType: plugin.id
  });

  const keyValue = computed(() => {
    return shortcutKey.value[plugin.id];
  });

  //  快速启动按键
  const quickStart = computed(() => {
    return keyValue.value || '暂未设置';
  });

  /**
   * @desc 打开按键设置弹窗
   */
  function openKeyDialog() {
    state.showDialog = true;
  }

  return {
    state,
    keyValue,
    quickStart,
    openKeyDialog
  };
}
