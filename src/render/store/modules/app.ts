import { ipcRenderer } from 'electron';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const state = {
  //  主面板windowId
  mainWindowId: 1,
  //  当前窗口ID
  windowId: {},
  //  应用设置
  setting: {}
};

const mutations = {
  setWindowId: (state: { windowId: any }, windowId: any) => {
    state.windowId = windowId;
  },
  setSetting: (state: { setting: any }, setting: any) => {
    state.setting = setting;
  }
};

const actions = {
  setWindowId({ commit }: any, windowId: any) {
    commit('setWindowId', windowId);
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
