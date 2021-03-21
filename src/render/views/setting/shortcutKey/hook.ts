/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//  消息提醒
import { ElNotification } from 'element-plus';
import { ipcRenderer } from 'electron';
import { reactive, ref } from 'vue';

const showDialog = ref(false);
const state = reactive({
  shortcutKeys: {},
  keyDialogType: ''
});

/**
 * 获取快捷键配置
 */
function getShortcutKeys() {
  ipcRenderer.invoke('shortcutKey-get').then(result => {
    state.shortcutKeys = result;
  });
}

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
function confirm() {
  getShortcutKeys();
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

export { showDialog, state, openKeyDialog, getShortcutKeys, confirm, close };
