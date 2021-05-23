import { ipcMain } from 'electron';
//  窗体管理
import windowManage from '@/main/core/window/windowManage';
//  窗口配置
import { browserWindowOptions } from '@/main/config/browserWindow';
import {
  //  打开插件窗体
  openPluginWindow
} from './pluginWin';
import DB from '@/main/dataBase/DB';

/**
 * 根据发送窗体id获取插件信息
 * @param id
 * @returns
 */
function getPluginBySenderId(id: number) {
  //  视图所属的插件窗体ID
  const { pluginWinId } = windowManage.viewWinMap[id];
  //  插件窗体信息
  const pluginWinItem = windowManage.pluginWin[pluginWinId];
  return pluginWinItem;
}

const app = {
  /**
   * 打开插件中创建的插件窗体
   * @param pluginWinItem
   * @param browserViewUrl
   * @param option
   * @returns
   */
  createBrowserWindow: (pluginWinItem, browserViewUrl, option = {}) => {
    const { pluginId, isDev, id } = pluginWinItem;
    //  默认窗体配置
    const defaultOption = browserWindowOptions.plugin;

    //  打开插件中创建的插件窗体
    return openPluginWindow(pluginId, Object.assign(defaultOption, option), isDev, id, browserViewUrl);
  },

  /**
   * 插件窗体间通信
   * @param pluginWinItem
   * @param id
   * @param event
   * @param data
   */
  communication: (pluginWinItem, id, event, data) => {
    const viewWinItem = windowManage.viewWinMap[id];

    if (viewWinItem) {
      const dataArg = typeof data === 'object' ? JSON.stringify(data) : data;

      viewWinItem.browserViewItem.webContents.executeJavaScript(`window.iHelper.trigger('${event}', ${dataArg})`);
    }
  }
};

ipcMain.on('plugin-app', (event, method, ...args) => {
  //  插件窗体信息
  const pluginWinItem = getPluginBySenderId(event.sender.id);

  if (app[method]) {
    const result = app[method](pluginWinItem, ...args);
    event.returnValue = result;
  }
});

const dbAPI = {
  //  插件数据库储存对象
  pluginDb: {},
  paging(db: DB, query) {
    return db.paging(query);
  },
  //  插入数据
  insert(db: DB, doc) {
    return db.insert(doc);
  },
  find(db: DB, query) {
    return db.find(query);
  },
  findOne(db: DB, query) {
    return db.findOne(query);
  },
  //  移除数据
  remove(db: DB, query, options) {
    return db.remove(query, options);
  },
  //  移除数据
  update(db: DB, query, updateQuery, options) {
    return db.update(query, updateQuery, options);
  }
};

//  插件——数据库
ipcMain.handle('plugin-db', (event, method, ...args) => {
  //  插件窗体信息
  const pluginWinItem = getPluginBySenderId(event.sender.id);

  if (dbAPI[method]) {
    const pluginId = pluginWinItem.pluginId;

    //  判断是否存在该插件的数据库实例
    if (!dbAPI.pluginDb[pluginId]) {
      dbAPI.pluginDb[pluginId] = new DB(pluginId);
    }
    const db = dbAPI.pluginDb[pluginId];

    return dbAPI[method](db, ...args);
  }
});
