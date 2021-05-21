import { ipcMain, WebPreferences, BrowserWindowConstructorOptions } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import pluginManage from '@/main/core/plugin/pluginManage';
//  窗口配置，基础地址
import { browserWindowOptions } from '@/main/config/browserWindow';

import { session, BrowserView } from 'electron';
import path from 'path';
import devManage from '@/main/core/dev/devManage';

const apisdk = global.isDev ? path.join(process.cwd(), 'public', 'apisdk.js') : path.join(__dirname, 'apisdk.js');

const pluginConfig = {
  ID: 'id',
  NAME: 'name',
  MAIN: 'main',
  MULTIPLE: 'multiple',
  DEV: 'dev',
  PRELOAD: 'preload'
};

/**
 * 打开插件窗体
 * @param pluginId 插件ID
 * @param option 窗体配置
 * @param url 窗体地址
 * @param isDev 是否开发模式
 * @param fatherId 窗体的父级窗体ID
 * @param browserViewUrl 视图地址
 */
function openPluginWindow(
  pluginId: string,
  option: BrowserWindowConstructorOptions,
  isDev = false,
  fatherId = null,
  browserViewUrl = ''
) {
  //  获取插件信息
  const plugin = isDev ? devManage.getPlugin(pluginId) : pluginManage.getPlugin(pluginId);
  //  插件是否多开
  const multiple = plugin[pluginConfig.MULTIPLE];
  //  已打开的插件ID
  const isOpenPlugin = windowManage.findPluginById(plugin[pluginConfig.ID]);

  //  已拥有插件 且 非设置多开
  if (isOpenPlugin && !multiple) {
    windowManage.findWindowById(isOpenPlugin.id).show();
  }

  //  创建插件窗体
  const pluginWindow = windowManage.createPluginBrowserWindow(pluginId, option, isDev, fatherId);
  //  插件窗体ID
  const pluginWinId = pluginWindow.id;
  //  创建视图实例
  let browserViewItem = initBrowserView(plugin, pluginWindow, browserViewUrl, isDev);
  //  视图ID
  const browserViewId = browserViewItem.webContents.id;

  //  插件窗体关闭时，回收视图信息或回收子插件窗体
  pluginWindow.on('closed', () => {
    //  从视图窗体映射中移除
    delete windowManage.viewWinMap[browserViewId];

    //  不存在fatherId，说明是主窗体，将全部子窗体关闭
    if (!fatherId) {
      const pluginWin = windowManage.pluginWin;

      for (const winId in pluginWin) {
        const pluginWinItem = pluginWin[winId];
        //  如插件窗体的fatherId为关闭窗体ID
        const isFatherWin = pluginWinItem.fatherId === pluginWinId;
        if (isFatherWin) {
          windowManage.closeWindow(pluginWinItem.id);
        }
      }
    }

    //  手动gc
    if (global.isDev) {
      browserViewItem.webContents.closeDevTools();
    }
    browserViewItem = null;
  });

  //  记录此视图与所属窗体ID的映射关系
  windowManage.viewWinMap[browserViewId] = pluginWinId;
}

/**
 * 生成插件视图
 * @param plugin
 * @param pluginWindow
 * @param browserViewUrl
 * @param isDev
 * @returns
 */
function initBrowserView(plugin, pluginWindow, browserViewUrl, isDev): BrowserView {
  //  创建插件会话
  const sessionItem = session.fromPartition(plugin[pluginConfig.NAME]);
  //  设置会话预加载文件
  sessionItem.setPreloads([apisdk]);
  //  读取配置的对象
  const readObj = isDev ? plugin[pluginConfig.DEV] || plugin : plugin;
  //  优先使用传入的视图地址
  const url = browserViewUrl || readObj[pluginConfig.MAIN];

  const webPreferences: WebPreferences = {
    //  启用NodeJS集成。
    nodeIntegration: true,
    //  允许调用源模块
    enableRemoteModule: true,
    session: sessionItem
  };

  //  如插件存在预加载文件
  if (plugin[pluginConfig.PRELOAD]) {
    webPreferences.preload = readObj[pluginConfig.PRELOAD];
  }

  //  实例化 BrowserView
  const browserViewItem = new BrowserView({
    webPreferences
  });
  //  获取插件窗体的大小
  const { width: pluginWidth, height: pluginHeight } = pluginWindow.getBounds();
  //  BrowserView挂载到插件窗口中
  pluginWindow.setBrowserView(browserViewItem);

  //  以下代码需在挂载后执行

  //  设置嵌入视图的位置
  browserViewItem.setBounds({
    x: 0,
    //  头部栏高度固定为40
    y: 40,
    width: pluginWidth,
    height: pluginHeight
  });
  //  设置视图自适应尺寸
  browserViewItem.setAutoResize({ width: true, height: true });
  //  加载页面资源
  browserViewItem.webContents.loadURL(url);

  //  监听生命周期，打开开发者控制台
  browserViewItem.webContents.on('dom-ready', (...args) => {
    args;
    if (global.isDev) {
      browserViewItem.webContents.openDevTools();
    }
  });

  return browserViewItem;
}

//  打开指定插件窗体
ipcMain.on('plugin-open', (event, pluginId, isDev, fatherId) => {
  const defaultOption = browserWindowOptions.plugin;

  //  打开插件窗体
  openPluginWindow(pluginId, defaultOption, isDev, fatherId);
});

//  打开插件中创建的插件窗体
ipcMain.handle('plugin-createBrowserWindow', (event, browserViewUrl, option = {}) => {
  //  视图所属的插件窗体ID
  const winId = windowManage.viewWinMap[event.sender.id];
  //  插件窗体信息
  const pluginWinItem = windowManage.pluginWin[winId];
  //  默认窗体配置
  const defaultOption = browserWindowOptions.plugin;
  const { pluginId, isDev, id } = pluginWinItem;

  //  打开插件中创建的插件窗体
  openPluginWindow(pluginId, Object.assign(defaultOption, option), isDev, id, browserViewUrl);
});

//  获取插件列表
ipcMain.handle('plugin-list-get', () => {
  return pluginManage.getPluginList();
});

//  获取插件详情
ipcMain.handle('plugin-detail-get', (event, id) => {
  return pluginManage.getPlugin(id);
});
