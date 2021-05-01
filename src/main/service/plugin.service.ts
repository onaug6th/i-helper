import { ipcMain } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import pluginManage from '@/main/core/plugin/pluginManage';

import { session, BrowserView } from 'electron';
import path from 'path';
import devManage from '@/main/core/dev/devManage';

const sdkPath = {
  dev: path.join(process.cwd(), 'public', 'apisdk.js'),
  prod: path.join(__dirname, 'apisdk.js')
};

const apisdk = global.isDev ? sdkPath.dev : sdkPath.prod;

//  打开指定应用的窗口
ipcMain.on('plugin-open', (event, id, isDev) => {
  const pluginWindow = windowManage.createPluginBrowserWindow(id, isDev);

  //  获取插件信息
  const plugin = isDev ? devManage.getPlugin(id) : pluginManage.getPlugin(id);
  //  创建插件会话
  const sessionItem = session.fromPartition(plugin.name);
  //  设置会话预加载文件
  sessionItem.setPreloads([apisdk]);

  const webPreferences: any = {
    //  启用NodeJS集成。
    nodeIntegration: true,
    //  允许调用源模块
    enableRemoteModule: true,
    session: sessionItem
  };

  //  如插件存在预加载文件
  if (plugin.preload) {
    webPreferences.preload = plugin.preload;
  }

  //  实例化 BrowserView
  const browserViewItem = new BrowserView({
    webPreferences
  });
  //  BrowserView挂载到插件窗口中
  pluginWindow.setBrowserView(browserViewItem);
  browserViewItem.setBounds({ x: 0, y: 40, width: 800, height: 600 });
  browserViewItem.setAutoResize({ width: true, height: true });
  browserViewItem.webContents.loadURL(plugin.main);

  browserViewItem.webContents.on('dom-ready', (...args) => {
    args;
    browserViewItem.webContents.openDevTools();
  });

  pluginWindow.on('closed', () => {
    browserViewItem.webContents.closeDevTools();
  });
});

//  获取插件列表
ipcMain.handle('plugin-list-get', () => {
  return pluginManage.getPluginList();
});

//  获取插件详情
ipcMain.handle('plugin-detail-get', (event, id) => {
  return pluginManage.getPlugin(id);
});
