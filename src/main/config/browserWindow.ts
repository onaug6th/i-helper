import path from 'path';

//  通用窗体配置
const commonOptions = {
  frame: false,
  minWidth: 750,
  minHeight: 600,
  width: 750,
  height: 600,
  webPreferences: {
    webSecurity: false,
    enableRemoteModule: true,
    nodeIntegration: true
  }
};

const browserWindowOptions = {
  //  基础窗口配置
  main: {
    ...commonOptions
  },
  //  便笺窗口配置
  note: {
    ...commonOptions,
    width: 290,
    height: 350,
    minWidth: 250
  },
  plugin: {
    ...commonOptions
  }
};

/**
 * 开发环境: http://localhost:9527
 * 正式环境: file://${__dirname}/index.html
 */
const winURL = global.isDev ? 'http://localhost:9527' : `file://${__dirname}/index.html`;

const apisdk = global.isDev ? path.join(process.cwd(), 'public', 'apisdk.js') : path.join(__dirname, 'apisdk.js');

const pluginConfigKey = {
  //  插件ID
  ID: 'id',
  //  插件名称
  NAME: 'name',
  //  插件LOGO
  LOGO: 'logo',
  //  插件主入口文件
  MAIN: 'main',
  //  插件是否多开
  MULTIPLE: 'multiple',
  //  插件开发模式配置
  DEV: 'dev',
  //  插件预加载文件
  PRELOAD: 'preload',
  //  插件配置文件地址
  JSON_PATH: 'jsonPath',
  //  插件配置文件所属文件夹地址
  FOLDER_PATH: 'folderPath',
  //  插件配置文件所属文件夹名称
  FOLDER_NAME: 'folderName'
};

export { browserWindowOptions, winURL, apisdk, pluginConfigKey };
