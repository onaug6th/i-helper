const globalEnv = process.env.NODE_ENV;
//  通用配置
const commonOptions = {
  frame: false,
  hasShadow: true,
  transparent: true,
  webPreferences: {
    webviewTag: true,
    enableRemoteModule: true,
    nodeIntegration: true
  }
};

const browserWindowOptions = {
  //  基础窗口配置
  main: {
    ...commonOptions,
    minWidth: 750,
    minHeight: 600,
    width: 750,
    height: 600
  },
  //  便笺窗口配置
  note: {
    ...commonOptions,
    width: 290,
    height: 350,
    minWidth: 250
  }
};

/**
 * 开发环境: http://localhost:9527
 * 正式环境: file://${__dirname}/index.html
 */
const winURL = globalEnv === 'development' ? 'http://localhost:9527' : `file://${__dirname}/index.html`;

export { browserWindowOptions, winURL };
