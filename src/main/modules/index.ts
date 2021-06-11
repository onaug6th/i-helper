import { App } from 'electron';
//  设置模块
import settingModule from './setting/setting.module';
//  快捷键模块
import shortcutKeyModule from './shortcutKey/shortcutKey.module';
//  托盘模块
import trayModule from './tray/tray.module';
//  插件模块
import pluginModule from './plugin/plugin.module';
//  开发者模块
import devModule from './dev/dev.module';
//  窗体模块
import windowModule from './window/window.module';
//  商店模块
import storeModule from './store/store.module';

export default {
  init(app: App): void {
    [settingModule, shortcutKeyModule, trayModule, pluginModule, devModule, windowModule, storeModule].forEach(
      module => {
        module.init(app);
      }
    );
  }
};
