//  通用窗体配置
const commonOptions = {
  frame: false,
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
    minWidth: 750,
    minHeight: 600,
    ...commonOptions
  },
  plugin: {
    ...commonOptions
  },
  update: {
    ...commonOptions,
    width: 320,
    height: 410
  }
};

/**
 * 开发环境: http://localhost:9527
 * 正式环境: file://${__dirname}/index.html
 */
const winURL = global.isDevMode ? 'http://localhost:9527' : `file://${__dirname}/index.html`;

export { browserWindowOptions, winURL };
