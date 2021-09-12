/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require('electron');

if (global.isDevMode) {
  console.info('apisdk ready');
}

const app = {
  getUser: () => ipcRenderer.sendSync('plugin-app', 'getUser'),
  getWinInfo: () => ipcRenderer.sendSync('plugin-app', 'getWinInfo'),
  getPluginWinsInfo: () => ipcRenderer.sendSync('plugin-app', 'getPluginWinsInfo'),

  createBrowserWindow: (url, options) => ipcRenderer.sendSync('plugin-app', 'createBrowserWindow', url, options),
  send: (id, event, ...data) => id && ipcRenderer.send('plugin-app', 'communication', id, event, ...data),
  setTitle: title => ipcRenderer.sendSync('plugin-app', 'setTitle', title),
  close: () => ipcRenderer.sendSync('plugin-app', 'close'),
  setAlwaysOnTop: alwaysOnTop => ipcRenderer.sendSync('plugin-app', 'setAlwaysOnTop', alwaysOnTop),
  minimize: () => ipcRenderer.sendSync('plugin-app', 'minimize'),
  unmaximize: () => ipcRenderer.sendSync('plugin-app', 'unmaximize'),
  maximize: () => ipcRenderer.sendSync('plugin-app', 'maximize'),
  hide: () => ipcRenderer.sendSync('plugin-app', 'hide')
};

const event = {
  on(event, cb) {
    iHelper.__cb__[event] = cb;
  },
  trigger(event, ...data) {
    iHelper.__cb__[event] && iHelper.__cb__[event](...data);
  }
};

const clipboard = {
  on: fn => {
    window.iHelper.clipboard.__cb__ = fn;
  },
  writeText: value => ipcRenderer.sendSync('plugin-clipboard', 'writeText', value),
  writeImage: value => ipcRenderer.sendSync('plugin-clipboard', 'writeImage', value),
  off: () => ipcRenderer.sendSync('plugin-clipboard', 'off')
};

const db = {
  insert: doc => ipcRenderer.sendSync('plugin-db', 'insert', doc),
  remove: (query, options) => ipcRenderer.sendSync('plugin-db', 'remove', query, options),
  update: (query, updateQuery, options) => ipcRenderer.sendSync('plugin-db', 'update', query, updateQuery, options),
  find: (query, desc) => ipcRenderer.sendSync('plugin-db', 'find', query, desc),
  findOne: query => ipcRenderer.sendSync('plugin-db', 'findOne', query),
  paging: (query, desc) => ipcRenderer.sendSync('plugin-db', 'paging', query, desc)
};

window.iHelper = {
  __cb__: {},
  ...app,
  ...event,
  clipboard,
  db
};
