//  创建窗口
import { BrowserWindow } from 'electron';

export interface WindowItem {
  //  窗体ID
  id: number;
  //  插件ID
  pluginId: string;
  //  窗体实例
  win: BrowserWindow;
  //  窗体的父窗体id
  fatherId?: number;
}

export interface PluginWin {
  [propName: number]: WindowItem;
}

//  视图ID，窗体ID映射
export interface ViewWinMap {
  //  视图ID：窗体ID
  [propName: number]: number;
}
