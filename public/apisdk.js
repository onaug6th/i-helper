/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require('electron');

console.info('apisdk ready');

window.iHelper = {
  createBrowserWindow(url, options) {
    ipcRenderer.invoke('plugin-app', 'createBrowserWindow', url, options);
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
