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
  ID: 'id',
  NAME: 'name',
  MAIN: 'main',
  MULTIPLE: 'multiple',
  DEV: 'dev',
  PRELOAD: 'preload'
};

export { browserWindowOptions, winURL, apisdk, pluginConfigKey };
