import { app, globalShortcut, ipcMain } from 'electron';
import settingManage from '@/main/core/setting/settingManage';
import windowManage from '@/main/core/window/windowManage';

const shortcutKey = settingManage.settingData.shortcutKey;

//  获取快捷键
ipcMain.handle('shortcutKey-get', () => {
  return settingManage.getSetting('shortcutKey');
});

//  更新快捷键
ipcMain.handle('shortcutKey-update', (event, result) => {
  const { type, key } = result;
  //  注销之前的快捷键
  globalShortcut.unregister(shortcutKey[type]);
  //  注册最新的快捷键
  globalShortcut.register(key, shortcutCallBack[type]);

  if (globalShortcut.isRegistered(key)) {
    //  更新设置
    settingManage.setSetting(`shortcutKey.${type}`, key);
    return true;
  } else {
    return false;
  }
});

/**
 * 快捷键回调
 */
const shortcutCallBack = {
  open: () => {
    const mainWindow = windowManage.mainWindow;
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  }
};

app.on('ready', () => {
  for (const i in shortcutKey) {
    globalShortcut.register(shortcutKey[i], shortcutCallBack[i]);
  }
});
