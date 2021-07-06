import { app } from 'electron';

//  https://blog.csdn.net/simplehouse/article/details/95502071
//  在描述文件里面添加全局属性无效，查过资料后只能在导入模块里声明
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      //  文件读取基础路径
      rootPath: string;
      //  是否开发模式
      isDev: boolean;
      //  窗体/插件信息映射
      pluginWinItems: any;
      //  视图窗体ID映射
      viewWins: any;
      //  下载文件夹路径
      downloadPath: string;
    }
  }
}

global.isDev = process.env.NODE_ENV !== 'production';
global.rootPath = global.isDev ? __dirname : app.getPath('userData');
global.downloadPath = app.getPath('downloads');

export {};
