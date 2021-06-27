//  创建窗口
import { BrowserWindow, BrowserView } from 'electron';

export interface PluginItem {
  //  窗体ID
  id: number;
  //  视图ID
  viewId: number;
  //  插件ID
  pluginId: string;
  //  窗体实例
  win: BrowserWindow;
  isDev?: boolean;
  //  窗体的父窗体id
  fatherId?: number | null;
}

export interface PluginWin {
  //  窗体ID：插件信息对象
  [propName: number]: PluginItem;
}

//  视图ID，窗体ID映射
export interface ViewWinMap {
  //  视图ID：窗体ID
  [propName: number]: {
    pluginWinId: number;
    browserViewItem: BrowserView;
  };
}
