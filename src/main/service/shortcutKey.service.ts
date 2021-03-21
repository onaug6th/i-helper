import { app, globalShortcut, ipcMain } from 'electron';
import * as settingService from './setting.service';
import * as browserWindowUtils from '@/main/utils/browserWindow';

const shortcutKey = settingService.settingData.shortcutKey;

//  获取快捷键
ipcMain.handle('shortcutKey-get', () => {
  return settingService.getSetting('shortcutKey');
});

//  更新快捷键
ipcMain.on('shortcutKey-update', (event, result) => {
  const { type, key } = result;
  //  注销之前的快捷键
  globalShortcut.unregister(shortcutKey[type]);
  //  注册最新的快捷键
  globalShortcut.register(key, shortcutCallBack[type]);
  //  更新设置
  settingService.setSetting(`shortcutKey.${type}`, key);
  //  获取最新设置
  settingService.getNewestAllSetting();
});

/**
 * 快捷键回调
 */
const shortcutCallBack = {
  open: () => {
    const homeWin = browserWindowUtils.windows.home;
    if (homeWin.isVisible()) {
      homeWin.hide();
    } else {
      homeWin.show();
    }
  }
};

app.on('ready', () => {
  for (const i in shortcutKey) {
    globalShortcut.register(shortcutKey[i], shortcutCallBack[i]);
  }
});
