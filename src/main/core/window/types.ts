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

//  视图ID，窗体ID映射
export interface ViewWinMap {
  //  视图ID：窗体ID
  [propName: number]: number;
}
