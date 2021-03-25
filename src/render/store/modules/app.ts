import { safeSet } from '@/render/utils';

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
  setSetting: (state: { setting: any }, { path, value }: any) => {
    if (path) {
      safeSet(state.setting, 'path', value);
    } else {
      state.setting = value;
    }
  }
};

const actions = {
  setWindowId({ commit }: any, windowId: any) {
    commit('setWindowId', windowId);
  },
  setSetting({ commit }: any, payload: any) {
    commit('setSetting', payload);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
