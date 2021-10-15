import { app } from 'electron';
import path from 'path';

//  https://blog.csdn.net/simplehouse/article/details/95502071
//  在描述文件里面添加全局属性无效，查过资料后只能在导入模块里声明
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      //  窗体服务
      windowService: any;
      //  窗体/插件信息映射
      pluginWinItems: any;
      //  视图窗体ID映射
      viewWins: any;

      //  文件读取基础路径
      rootPath: string;
      //  是否开发模式
      isDevMode: boolean;
      //  下载文件夹路径
      downloadPath: string;
      //  强制退出
      forceQuit: boolean;
      //  应用图标地址
      appLogoPath: string;
      //  托盘图标地址
      appTrayPath: string;
      //  是苹果系统
      isMac: boolean;
      //  是windows系统
      isWindows: boolean;
    }
  }
}

global.isDevMode = process.env.NODE_ENV !== 'production';

global.rootPath = global.isDevMode ? __dirname : app.getPath('userData');
global.downloadPath = app.getPath('downloads');

global.isMac = process.platform == 'darwin';
global.isWindows = process.platform == 'win32';

let appTrayPath: string;
let appLogoPath: string;

if (global.isWindows) {
  appTrayPath = global.isDevMode
    ? path.join(process.cwd(), 'public', 'favicon.ico')
    : path.join(__dirname, 'favicon.ico');

  appLogoPath = global.isDevMode
    ? path.join(process.cwd(), 'public', 'favicon.ico')
    : path.join(__dirname, 'favicon.ico');
} else {
  appTrayPath = global.isDevMode
    ? path.join(process.cwd(), 'public', 'tray-darwin.png')
    : path.join(__dirname, 'tray-darwin.png');

  appLogoPath = global.isDevMode
    ? path.join(process.cwd(), 'public', 'app-darwin.png')
    : path.join(__dirname, 'app-darwin.png');
}

global.appTrayPath = appTrayPath;
global.appLogoPath = appLogoPath;

export {};
