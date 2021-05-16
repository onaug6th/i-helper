import { ipcMain, WebPreferences } from 'electron';
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

//  打开指定应用的窗口
ipcMain.on('plugin-open', (event, pluginId, isDev) => {
  //  获取插件信息
  const plugin = isDev ? devManage.getPlugin(pluginId) : pluginManage.getPlugin(pluginId);
  //  插件是否多开
  const multiple = plugin[pluginConfig.MULTIPLE];
  //  已打开的插件ID
  const pluginWinId = windowManage.pluginWinMap[plugin[pluginConfig.ID]] as number;

  //  已拥有插件 且 非设置多开
  if (pluginWinId && !multiple) {
    windowManage.findWindowById(pluginWinId).show();
  }

  //  创建插件窗体
  const pluginWindow = windowManage.createPluginBrowserWindow(pluginId, browserWindowOptions.plugin, isDev);

  //  创建插件会话
  const sessionItem = session.fromPartition(plugin[pluginConfig.NAME]);
  //  设置会话预加载文件
  sessionItem.setPreloads([apisdk]);
  //  读取配置的对象
  const readObj = isDev ? plugin[pluginConfig.DEV] || plugin : plugin;

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
  let browserViewItem = new BrowserView({
    webPreferences
  });
  //  BrowserView挂载到插件窗口中
  pluginWindow.setBrowserView(browserViewItem);
  //  获取插件窗体的大小
  const { width: pluginWidth, height: pluginHeight } = pluginWindow.getBounds();

  //  设置嵌入视图的位置
  browserViewItem.setBounds({
    x: 0,
    //  头部栏高度固定为40
    y: 40,
    width: pluginWidth,
    height: pluginHeight
  });
  browserViewItem.setAutoResize({ width: true, height: true });
  browserViewItem.webContents.loadURL(readObj[pluginConfig.MAIN]);

  //  监听生命周期，打开开发者控制台
  browserViewItem.webContents.on('dom-ready', (...args) => {
    args;
    browserViewItem.webContents.openDevTools();
  });

  //  插件窗体关闭时，关闭并回收
  pluginWindow.on('closed', () => {
    browserViewItem.webContents.closeDevTools();
    browserViewItem = null;

    //  插件关闭时，需要判断是不是主插件。
    //  如果是主插件，将全部子插件关闭
    //  如果不是，仅关闭子插件
  });

  //  记录此视图与所属窗体ID的映射关系
  windowManage.viewWinMap[browserViewItem.webContents.id] = pluginWindow.id;
});

ipcMain.handle('plugin-createBrowserWindow', (event, url, option) => {
  debugger;
  const pluginId = windowManage.viewWinMap[event.sender.id];
  pluginId;
  option;
});

//  获取插件列表
ipcMain.handle('plugin-list-get', () => {
  return pluginManage.getPluginList();
});

//  获取插件详情
ipcMain.handle('plugin-detail-get', (event, id) => {
  return pluginManage.getPlugin(id);
});
