/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require('electron');

console.info('apisdk ready');

window.iHelper = {
  __cb__: {},
  createBrowserWindow: (url, options) => ipcRenderer.sendSync('plugin-app', 'createBrowserWindow', url, options),
  send: (id, event, data) => ipcRenderer.send('plugin-app', 'communication', id, event, data),
  on(event, cb) {
    iHelper.__cb__[event] = cb;
  },
  trigger(event, data) {
    iHelper.__cb__[event] && iHelper.__cb__[event](data);
  },
  db: Object.freeze({
    paging: query => ipcRenderer.invoke('plugin-db', 'paging', query),
    insert: doc => ipcRenderer.invoke('plugin-db', 'insert', doc),
    find: query => ipcRenderer.invoke('plugin-db', 'find', query),
    findOne: query => ipcRenderer.invoke('plugin-db', 'findOne', query),
    remove: (query, options) => ipcRenderer.invoke('plugin-db', 'remove', query, options),
    update: (query, updateQuery, options) => ipcRenderer.invoke('plugin-db', 'update', query, updateQuery, options)
  })
};
