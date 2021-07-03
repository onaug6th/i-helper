import { globalShortcut } from 'electron';
import windowService from '@/main/modules/window/window.service';
import appStorageService from '@/main/modules/appStorage/appStorage.service';
import pluginService from '@/main/modules/plugin/plugin.service';

/**
 * 快捷键回调
 */
const shortcutCallback = {
  open: () => {
    const mainWindow = windowService.mainWindow;
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  }
};

/**
 * 插件快捷键打开
 * @param pluginId
 */
function pluginOpenCallback(pluginId: string): any {
  return function(): void {
    const pluginItem = windowService.findPluginItemByPluginId(pluginId);

    if (pluginItem) {
      const pluginItemWin = pluginItem.win;
      if (pluginItemWin.isVisible()) {
        pluginItemWin.hide();
      } else {
        pluginItemWin.show();
      }
    } else {
      pluginService.pluginStart(pluginId);
    }
  };
}

class ShortcutKeyService {
  storageName = 'shortcutKey';

  shortcutKey = {};

  /**
   * 应用初始化时执行
   */
  appOnReady() {
    this.shortcutKey = appStorageService.getData(this.storageName);

    for (const keyType in this.shortcutKey) {
      globalShortcut.register(this.shortcutKey[keyType], shortcutCallback[keyType] || pluginOpenCallback(keyType));
    }
  }

  /**
   * 注册应用储存初始化的数据
   */
  register() {
    return {
      [this.storageName]: {
        open: 'Ctrl+Space'
      }
    };
  }

  /**
   * 更新快捷键
   * @param keyType 按键操作类型
   * @param keyValue 按键值
   */
  shortcutKeyUpdate(keyType: string, keyValue: string): boolean {
    if (this.shortcutKey[keyType]) {
      //  注销之前的快捷键
      globalShortcut.unregister(this.shortcutKey[keyType]);
    }

    //  注册最新的快捷键
    globalShortcut.register(keyValue, shortcutCallback[keyType] || pluginOpenCallback(keyType));

    //  注册成功
    if (globalShortcut.isRegistered(keyValue)) {
      //  更新内存中的快捷键设置
      this.shortcutKey[keyType] = keyValue;
      //  更新全局设置数据
      appStorageService.setData(`${this.storageName}.${keyType}`, keyValue);
      return true;
    } else {
      return false;
    }
  }
}

export default new ShortcutKeyService();
