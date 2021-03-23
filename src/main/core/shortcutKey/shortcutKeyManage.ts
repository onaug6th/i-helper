import { globalShortcut } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import settingManage from '@/main/core/setting/settingManage';

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

class ShortcutKeyManage {
  shortcutKey = settingManage.settingData.shortcutKey;

  /**
   * 应用初始化时执行
   */
  appOnReady() {
    for (const i in this.shortcutKey) {
      globalShortcut.register(this.shortcutKey[i], shortcutCallBack[i]);
    }
  }

  /**
   * 获取快捷键数据
   */
  shortcutKeyGet() {
    return this.shortcutKey;
  }

  /**
   * 更新快捷键
   * @param type 按键操作类型
   * @param key 按键
   */
  shortcutKeyUpdate(type: string, key: string): boolean {
    //  注销之前的快捷键
    globalShortcut.unregister(this.shortcutKey[type]);
    //  注册最新的快捷键
    globalShortcut.register(key, shortcutCallBack[type]);

    if (globalShortcut.isRegistered(key)) {
      //  更新内存中的快捷键设置
      this.shortcutKey[type] = key;
      //  更新全局设置数据
      settingManage.setSetting(`shortcutKey.${type}`, key);
      return true;
    } else {
      return false;
    }
  }
}

export default new ShortcutKeyManage();
