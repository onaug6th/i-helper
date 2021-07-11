import { ipcRenderer, remote } from 'electron';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const state = {
  //  主面板windowId
  mainWindowId: 1,
  //  当前窗体实例
  currentWindow: {},
  //  应用版本号
  version: '',
  //  应用设置
  setting: {},
  //  快捷键设置
  shortcutKey: {}
};

const mutations = {
  setApp: (state: any, { currentWindow, version }) => {
    state.currentWindow = currentWindow;
    state.version = version;
  },
  setSetting: (state: { setting: any }, setting: any) => {
    state.setting = setting;
  },
  setShortcutKey: (state: { shortcutKey: any }, shortcutKey: any) => {
    state.shortcutKey = shortcutKey;
  }
};

const actions = {
  setApp({ commit }: any) {
    const currentWindow = remote.getCurrentWindow();
    const version = remote.app.getVersion();
    commit('setApp', { currentWindow, version });
  },
  setSetting({ commit }: any) {
    //  获取应用设置
    ipcRenderer.invoke('setting-get').then(setting => {
      commit('setSetting', setting);
    });
  },
  setShortcutKey({ commit }: any) {
    //  获取快捷键设置
    ipcRenderer.invoke('shortcutKey-get').then(shortcutKey => {
      commit('setShortcutKey', shortcutKey);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
