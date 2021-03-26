/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//  消息提醒
import { reactive, ref } from 'vue';
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
 * 关闭
 */
function close() {
  showDialog.value = false;
}

export { showDialog, state, openKeyDialog, close };
