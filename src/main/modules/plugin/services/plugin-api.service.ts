import windowService from '@/main/modules/window/window.service';
import pluginSevice from '../plugin.service';
import { IpcMainEvent } from 'electron';

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
   * @param viewUrl
   * @param option
   * @returns
   */
  createBrowserWindow: (pluginWinItem, viewUrl: string, options: any): number => {
    const { pluginId, isDev, id } = pluginWinItem;

    //  无配置新开实例，会复用同样地址的window
    // if (!option.newInstance) {
    // }

    return pluginSevice.pluginStart(pluginId, {
      options,
      isDev,
      fatherId: id,
      viewUrl
    }).viewId;
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

function appApiHandler(event: IpcMainEvent, method: string, ...args: any[]): void {
  //  插件窗体信息
  const pluginWinItem = windowService.getPluginByViewId(event.sender.id);

  if (appApi[method]) {
    const result = appApi[method](pluginWinItem, ...args);
    event.returnValue = result;
  }
}

import DB from '@/main/dataBase/DB';

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

async function dbApiHandler(event: IpcMainEvent, method: string, ...args: any[]): Promise<void> {
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
}

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

function clipboardApiHandler(event: IpcMainEvent, method: string, ...args: any[]): void {
  //  插件窗体信息
  const pluginWinItem = windowService.getPluginByViewId(event.sender.id);

  event.returnValue = clipboardAPI[method](pluginWinItem, ...args);
}

export { appApiHandler, dbApiHandler, clipboardApiHandler };
