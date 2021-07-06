//  插件窗体项
interface PluginWinItem {
  //  窗体ID
  id: number;
  //  视图ID
  viewId: number;
  //  插件ID
  pluginId: string;
  //  窗体实例
  win: Electron.BrowserWindow;
  //  是否开发者模式
  isDev?: boolean;
  //  窗体的父窗体id
  fatherId?: number | null;
  //  父窗体的视图ID
  fatherViewId?: number | null;
}

//  插件窗体集合
interface PluginWinItems {
  [propName: number]: PluginWinItem;
}

//  视图项
interface ViewWin {
  //  所属窗体ID
  pluginWinId: number;
  //  所属插件ID
  pluginId: string;
  //  view实例
  viewItem: Electron.BrowserView;
}

//  视图项集合
interface ViewWins {
  //  视图ID：窗体ID
  [propName: number]: ViewWin;
}
