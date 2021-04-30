/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require('electron');

console.info('apisdk ready');

window.iHelper = {
  getPlugin(id) {
    ipcRenderer.invoke('plugin-detail-get', id);
  },
  test() {
    console.info('apisdk is ready');
  }
};
