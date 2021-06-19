import { ipcRenderer, remote } from 'electron';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const state = {
  //  主面板windowId
  mainWindowId: 1,
  //  当前窗体实例
  currentWindow: {},
  //  应用设置
  setting: {},
  //  快捷键设置
  shortcutKey: {}
};

const mutations = {
  setWindow: (state: any, currentWindow) => {
    state.currentWindow = currentWindow;
  },
  setSetting: (state: { setting: any }, setting: any) => {
    state.setting = setting;
  },
  setShortcutKey: (state: { shortcutKey: any }, shortcutKey: any) => {
    state.shortcutKey = shortcutKey;
  }
};

const actions = {
  setWindow({ commit }: any) {
    const currentWindow = remote.getCurrentWindow();

    commit('setWindow', currentWindow);
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
