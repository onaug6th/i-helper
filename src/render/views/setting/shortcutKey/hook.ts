/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//  消息提醒
import { ElNotification } from 'element-plus';
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
const showDialog = ref(false);
const state = reactive({
  keyDialogType: ''
});

/**
 * 打开按键设置弹窗
 */
function openKeyDialog(type) {
  showDialog.value = true;
  state.keyDialogType = type;
}

/**
 * 确认
 */
function confirm({ type, value }) {
  const store = useStore();
  store.dispatch('app/setSetting', {
    path: `shortcutKey.${type}`,
    value
  });

  ElNotification({
    type: 'success',
    message: '设置成功'
  });
  close();
}

/**
 * 关闭
 */
function close() {
  showDialog.value = false;
}

export { showDialog, state, openKeyDialog, confirm, close };
