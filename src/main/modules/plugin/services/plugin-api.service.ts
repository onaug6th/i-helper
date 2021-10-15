import windowService from '@/main/modules/window/window.service';
import pluginSevice from '../plugin.service';
import userService from '../../user/user.service';

const appApi = {
  /**
   * 获取用户信息
   */
  getUser: () => {
    const user = userService.getUser();

    return user;
  },

  /**
   * 获取窗体信息
   * @param pluginWinItem
   * @returns
   */
  getWinInfo: (pluginWinItem: PluginWinItem) => {
    const { pluginId, viewId, fatherViewId, isDev } = pluginWinItem;

    return {
      pluginId,
      viewId,
      fatherViewId,
      isDev
    };
  },

  /**
   * 获取此插件打开的所有窗体
   * @param pluginWinItem
   * @returns
   */
  getPluginWinsInfo: (pluginWinItem: PluginWinItem) => {
    const { pluginId } = pluginWinItem;

    return windowService.getPluginWinItemByPluginId(pluginId).map(pluginWinItem => {
      return {
        pluginId,
        fatherViewId: pluginWinItem.fatherViewId,
        viewUrl: pluginWinItem.viewUrl,
        viewId: pluginWinItem.viewId
      };
    });
  },

  /**
   * 打开插件中创建的插件窗体
   * @param pluginWinItem
   * @param viewUrl
   * @param option
   * @returns
   */
  createBrowserWindow: (
    pluginWinItem: PluginWinItem,
    viewUrl: string,
    options: Electron.BrowserWindowConstructorOptions & { newWin: boolean } = { newWin: false }
  ): number => {
    const { pluginId, isDev, id } = pluginWinItem;

    //  无配置新开实例，会将之前同样地址的window打开并返回
    if (!options.newWin) {
      const pluginWinItemArr = windowService.getPluginWinItemByPluginId(pluginId);
      const sameUrlWinItem = pluginWinItemArr.find(pluginWinItem => pluginWinItem.viewUrl === viewUrl);
      if (sameUrlWinItem) {
        sameUrlWinItem.win.show();
        return sameUrlWinItem.viewId;
      }
    }

    const pluginResult = pluginSevice.pluginStart(pluginId, {
      options,
      isDev,
      fatherId: id,
      viewUrl
    });

    return pluginResult.viewId;
  },

  /**
   * 插件窗体间通信
   * @param pluginWinItem
   * @param id
   * @param event
   * @param data
   */
  communication: (pluginWinItem: PluginWinItem, id: number, event: string, ...data: Array<any>): void => {
    const viewWinItem = windowService.viewWins[id];
    const argsStr = data.map(arg => JSON.stringify(arg)).join(',');
    if (viewWinItem) {
      viewWinItem.viewItem.webContents.executeJavaScript(`window.iHelper.trigger('${event}', ${argsStr})`);
    }
  },

  /**
   * 插件窗体置顶
   * @param pluginWinItem
   * @param alwaysOnTop
   */
  setAlwaysOnTop: (pluginWinItem: PluginWinItem, alwaysOnTop: boolean) => {
    pluginWinItem.win.setAlwaysOnTop(alwaysOnTop);
  },

  /**
   * 插件窗体最小化
   * @param pluginWinItem
   */
  minimize: (pluginWinItem: PluginWinItem) => {
    pluginWinItem.win.minimize();
  },

  /**
   * 插件窗体缩放
   * @param pluginWinItem
   */
  unmaximize: (pluginWinItem: PluginWinItem) => {
    pluginWinItem.win.unmaximize();
  },

  /**
   * 插件窗体最大化
   * @param pluginWinItem
   */
  maximize: (pluginWinItem: PluginWinItem) => {
    pluginWinItem.win.maximize();
  },

  /**
   * 隐藏插件窗体
   * @param pluginWinItem
   */
  hide: (pluginWinItem: PluginWinItem) => {
    pluginWinItem.win.hide();
  },

  /**
   * 关闭窗体
   * @param pluginWinItem
   */
  close: (pluginWinItem: PluginWinItem) => {
    windowService.closeWindow(pluginWinItem.id);
  },

  /**
   * 设置插件窗体标题
   * @param allInfo
   * @param title
   */
  setTitle: (pluginWinItem: PluginWinItem, title: string) => {
    pluginWinItem.win.webContents.send('plugin-update-title', title);
  }
};

/**
 * 插件应用api处理函数
 * @param event
 * @param method
 * @param args
 */
function appApiHandler(event: Electron.IpcMainEvent, method: string, ...args: any[]): void {
  //  插件窗体
  const pluginWinItem = windowService.getPluginWinItemByViewId(event.sender.id);

  if (appApi[method]) {
    const result = appApi[method](pluginWinItem, ...args);
    event.returnValue = result;
  }
}

import DB from '@/main/dataBase/DB';

const dbAPI: {
  pluginDb: {
    [propsName: string]: DB;
  };
  [propsName: string]: any;
} = {
  //  插件数据库储存对象
  pluginDb: {},
  //  分页查找
  paging(db: DB, query) {
    return db.paging(query);
  },
  //  插入数据
  insert(db: DB, doc) {
    return db.insert(doc);
  },
  //  寻找并排序
  find(db: DB, query, sort) {
    return db.find(query, sort);
  },
  //  寻找单个
  findOne(db: DB, query) {
    return db.findOne(query);
  },
  //  移除数据
  remove(db: DB, query, options) {
    return db.remove(query, options);
  },
  //  更新数据
  update(db: DB, query, updateQuery, options) {
    return db.update(query, updateQuery, options);
  }
};

/**
 * 数据库api处理函数
 * @param event
 * @param method
 * @param args
 */
async function dbApiHandler(event: Electron.IpcMainEvent, method: string, ...args: any[]): Promise<void> {
  //  插件窗体
  const pluginWinItem = windowService.getPluginWinItemByViewId(event.sender.id);

  if (dbAPI[method]) {
    const pluginId = pluginWinItem.pluginId;

    //  判断是否存在该插件的数据库实例
    if (!dbAPI.pluginDb[pluginId]) {
      dbAPI.pluginDb[pluginId] = new DB(pluginId);
    }
    const db = dbAPI.pluginDb[pluginId];

    event.returnValue = await dbAPI[method](db, ...args);
  }
}

import { clipboard, nativeImage } from 'electron';

const clipboardAPI = {
  writeText(pluginWinItem: PluginWinItem, value: string) {
    clipboard.writeText(value);
  },
  writeImage(pluginWinItem: PluginWinItem, value: string) {
    clipboard.writeImage(nativeImage.createFromDataURL(value));
  },
  off(pluginWinItem: PluginWinItem) {
    pluginSevice.clipboardOff(pluginWinItem.pluginId);
  }
};

/**
 * 剪贴板api处理函数
 * @param event
 * @param method
 * @param args
 */
function clipboardApiHandler(event: Electron.IpcMainEvent, method: string, ...args: any[]): void {
  //  插件窗体
  const pluginWinItem = windowService.getPluginWinItemByViewId(event.sender.id);

  event.returnValue = clipboardAPI[method](pluginWinItem, ...args);
}

export { appApiHandler, dbApiHandler, clipboardApiHandler };
