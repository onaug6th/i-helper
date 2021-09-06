import { globalShortcut } from 'electron';
import windowService from '@/main/modules/window/window.service';
import appStorageService from '@/main/modules/appStorage/appStorage.service';
import pluginService from '@/main/modules/plugin/plugin.service';

const isPluginType = (keyType: string) => keyType.includes('-');
class ShortcutKeyService {
  storageName = 'shortcutKey';

  shortcutKey = {};

  //  默认设置
  defaultData = {
    [this.storageName]: {
      open: 'Ctrl+Space'
    }
  };

  //  快捷键回调
  shortcutCallback = {
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
   * 应用初始化时执行
   */
  appOnReady() {
    this.shortcutKey = appStorageService.getData(this.storageName);

    for (const keyType in this.shortcutKey) {
      const isPlugin = isPluginType(keyType);
      let fn = this.shortcutCallback[keyType];

      if (isPlugin) {
        //  @Todo: 这段代码有问题
        const pluginWinItem = windowService.getPluginWinItemByPluginId(keyType);
        if (pluginWinItem) {
          fn = this.pluginOpenCallback.bind(this, keyType);
        }
        //  移除快捷键设置
        else {
          this.shortcutKeyUpdate(keyType, '');
        }
      }

      if (fn) {
        globalShortcut.register(this.shortcutKey[keyType], fn);
      }
    }
  }

  /**
   * 注册应用储存初始化的数据
   */
  register() {
    return this.defaultData;
  }

  /**
   * 插件快捷键打开
   * @param pluginId
   */
  pluginOpenCallback(pluginId: string): any {
    const plugin = pluginService.getPlugin(pluginId);

    //  没有此插件，注销
    if (!plugin) {
      this.shortcutKeyUpdate(pluginId, '');
      return;
    }

    const pluginWinItem = windowService.getPluginWinItemByPluginId(pluginId)[0];

    if (pluginWinItem) {
      const win = pluginWinItem.win;
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    } else {
      pluginService.pluginStart(pluginId);
    }
  }

  /**
   * 设置快捷键内容及储存数据
   * @param keyType
   * @param keyValue
   */
  setShortcutKeyData(keyType: string, keyValue: string) {
    //  更新内存中的快捷键设置
    this.shortcutKey[keyType] = keyValue;
    //  更新全局设置数据
    appStorageService.setData(`${this.storageName}.${keyType}`, keyValue);
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

    if (keyValue) {
      //  注册最新的快捷键
      globalShortcut.register(keyValue, this.shortcutCallback[keyType] || this.pluginOpenCallback.bind(this, keyType));
      //  注册成功
      if (globalShortcut.isRegistered(keyValue)) {
        this.setShortcutKeyData(keyType, keyValue);
        return true;
      } else {
        return false;
      }
    } else {
      this.setShortcutKeyData(keyType, '');
      return true;
    }
  }
}

export default new ShortcutKeyService();
