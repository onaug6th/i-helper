/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require('electron');

if (global.isDev) {
  console.info('apisdk ready');
}

window.iHelper = {
  __cb__: {},
  getWinInfo: () => ipcRenderer.sendSync('plugin-app', 'winInfo'),
  createBrowserWindow: (url, options) => ipcRenderer.sendSync('plugin-app', 'createBrowserWindow', url, options),
  send: (id, event, ...data) => ipcRenderer.send('plugin-app', 'communication', id, event, ...data),
  close: () => ipcRenderer.sendSync('plugin-app', 'close'),
  setTitle: title => ipcRenderer.sendSync('plugin-app', 'setTitle', title),
  on(event, cb) {
    iHelper.__cb__[event] = cb;
  },
  trigger(event, ...data) {
    iHelper.__cb__[event] && iHelper.__cb__[event](...data);
  },
  clipboard: {
    on: fn => {
      window.iHelper.clipboard.__cb__ = fn;
    },
    writeText: value => ipcRenderer.sendSync('plugin-clipboard', 'writeText', value),
    writeImage: value => ipcRenderer.sendSync('plugin-clipboard', 'writeImage', value),
    off: () => ipcRenderer.sendSync('plugin-clipboard', 'off')
  },
  db: {
    insert: doc => ipcRenderer.sendSync('plugin-db', 'insert', doc),
    remove: (query, options) => ipcRenderer.sendSync('plugin-db', 'remove', query, options),
    update: (query, updateQuery, options) => ipcRenderer.sendSync('plugin-db', 'update', query, updateQuery, options),
    find: (query, desc) => ipcRenderer.sendSync('plugin-db', 'find', query, desc),
    findOne: query => ipcRenderer.sendSync('plugin-db', 'findOne', query),
    paging: (query, desc) => ipcRenderer.sendSync('plugin-db', 'paging', query, desc)
  }
};
