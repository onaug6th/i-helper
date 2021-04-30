//  通用配置
const commonOptions = {
  frame: false,
  hasShadow: true,
  transparent: true,
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
    ...commonOptions,
    webPreferences: {
      ...commonOptions.webPreferences,
      webviewTag: true
    }
  }
};

/**
 * 开发环境: http://localhost:9527
 * 正式环境: file://${__dirname}/index.html
 */
const winURL = global.isDev ? 'http://localhost:9527' : `file://${__dirname}/index.html`;

export { browserWindowOptions, winURL };
