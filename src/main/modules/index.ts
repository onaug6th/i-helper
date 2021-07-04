import { App } from 'electron';
//  应用储存模块
import appStorageModule from './appStorage/appStorage.module';
//  设置模块
import settingModule from './setting/setting.module';
//  快捷键模块
import shortcutKeyModule from './shortcutKey/shortcutKey.module';
//  托盘模块
import trayModule from './tray/tray.module';
//  插件模块
import pluginModule from './plugin/plugin.module';
import pluginService from './plugin/plugin.service';
//  开发者模块
import devModule from './dev/dev.module';
//  窗体模块
import windowModule from './window/window.module';
//  商店模块
import storeModule from './store/store.module';

export default {
  async init(app: App): Promise<void> {
    //  插件模块、商店模块、开发者模块初始化
    await Promise.all([pluginModule.init(app), storeModule.init(app), devModule.init(app)]);

    //  应用数据模块初始化
    appStorageModule.init(app);

    //  设置模块初始化（依赖应用数据模块）
    settingModule.init(app);
    //  快捷键模块初始化（依赖应用数据模块、插件模块）
    shortcutKeyModule.init(app);

    //  托盘模块初始化
    trayModule.init(app);
    //  窗体模块初始化
    windowModule.init(app);

    //  应用启动时，对我的插件/插件商店的插件安装情况进行初始化
    pluginService.setPluginInstallInfo();
  }
};
