import { ipcRenderer, remote } from 'electron';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const state = {
  //  主面板windowId
  mainWindowId: 1,
  //  当前窗体实例
  currentWindow: {},
  //  应用设置
  setting: {}
};

const mutations = {
  setWindow: (state: any, currentWindow) => {
    state.currentWindow = currentWindow;
  },
  setSetting: (state: { setting: any }, setting: any) => {
    state.setting = setting;
  }
};

const actions = {
  setWindow({ commit }: any) {
    const currentWindow = remote.getCurrentWindow();

    commit('setWindow', currentWindow);
  },
  setNewestSetting({ commit }: any) {
    //  获取应用设置
    ipcRenderer.invoke('get-setting').then(setting => {
      commit('setSetting', setting);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
