import { ipcMain } from 'electron';
//  窗体管理
import windowService from '@/main/modules/window/window.service';
import {
  //  打开插件窗体
  openPluginWindow
} from './pluginWin';

import DB from '@/main/dataBase/DB';

const appApi = {
  /**
   * 获取窗体信息
   * @param pluginWinItem
   * @returns
   */
  winInfo: pluginWinItem => {
    const { pluginId, viewId, fatherViewId, isDev } = pluginWinItem;

    return {
      pluginId,
      viewId,
      fatherViewId,
      isDev
    };
  },

  /**
   * 打开插件中创建的插件窗体
   * @param pluginWinItem
   * @param browserViewUrl
   * @param option
   * @returns
   */
  createBrowserWindow: (pluginWinItem, browserViewUrl: string, option: any): number => {
    const { pluginId, isDev, id } = pluginWinItem;

    //  无配置新开实例，会复用同样地址的window
    // if (!option.newInstance) {
    // }

    //  打开插件中创建的插件窗体
    return openPluginWindow(pluginId, option, isDev, id, browserViewUrl).browserViewId;
  },

  /**
   * 插件窗体间通信
   * @param pluginWinItem
   * @param id
   * @param event
   * @param data
   */
  communication: (pluginWinItem, id: number, event: string, ...data: any): void => {
    const viewWinItem = windowService.viewWinMap[id];
    const argsStr = data.map(arg => JSON.stringify(arg)).join(',');
    if (viewWinItem) {
      viewWinItem.viewItem.webContents.executeJavaScript(`window.iHelper.trigger('${event}', ${argsStr})`);
    }
  },

  /**
   * 关闭窗体
   * @param pluginWinItem
   */
  close: pluginWinItem => {
    windowService.closeWindow(pluginWinItem.id);
  },

  /**
   * 设置插件窗体标题
   * @param allInfo
   * @param title
   */
  setTitle: (pluginWinItem, title: string) => {
    pluginWinItem.win.webContents.send('plugin-update-title', title);
  }
};

ipcMain.on('plugin-app', (event, method, ...args) => {
  //  插件窗体信息
  const pluginWinItem = windowService.getPluginByViewId(event.sender.id);

  if (appApi[method]) {
    const result = appApi[method](pluginWinItem, ...args);
    event.returnValue = result;
  }
});

const dbAPI = {
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

//  插件——数据库
ipcMain.on('plugin-db', async (event, method, ...args) => {
  //  插件窗体信息
  const pluginWinItem = windowService.getPluginByViewId(event.sender.id);

  if (dbAPI[method]) {
    const pluginId = pluginWinItem.pluginId;

    //  判断是否存在该插件的数据库实例
    if (!dbAPI.pluginDb[pluginId]) {
      dbAPI.pluginDb[pluginId] = new DB(pluginId);
    }
    const db = dbAPI.pluginDb[pluginId];

    event.returnValue = await dbAPI[method](db, ...args);
  }
});

//  剪贴板模块及类型
import { clipboard, nativeImage } from 'electron';

const clipboardAPI = {
  writeText(pluginWinItem, value) {
    clipboard.writeText(value);
  },
  writeImage(pluginWinItem, value) {
    clipboard.writeImage(nativeImage.createFromDataURL(value));
  },
  off() {
    debugger;
  }
};

ipcMain.on('plugin-clipboard', async (event, method, ...args) => {
  //  插件窗体信息
  const pluginWinItem = windowService.getPluginByViewId(event.sender.id);

  event.returnValue = clipboardAPI[method](pluginWinItem, ...args);
});
