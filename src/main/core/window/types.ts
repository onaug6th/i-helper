//  创建窗口
import { BrowserWindow, BrowserView } from 'electron';

export interface WindowItem {
  //  窗体ID
  id: number;
  //  窗体的类型
  type: string;
  //  窗体实例
  win: BrowserWindow;
  //  窗体内的view实例
  view?: BrowserView;
  //  窗体的父窗体id
  fatherId?: number;
}

export interface Windows {
  [propName: number]: WindowItem;
}

//  视图ID，插件ID映射
export interface ViewPluginMap {
  //  视图ID：插件ID
  [propName: number]: string;
}

//  插件ID，窗体ID映射表
export interface PluginWinMap {
  //  插件ID: 窗体ID
  [propName: string]: number;
}
