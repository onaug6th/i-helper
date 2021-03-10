/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const state = {
  //  主面板windowId
  mainWindowId: 1,
  //  当前窗口信息
  windowInfo: {}
};

const mutations = {
  setWindowInfo: (state: { windowInfo: any }, windowInfo: any) => {
    state.windowInfo = windowInfo;
  }
};

const actions = {
  setWindowInfo({ commit }: any, windowInfo: any) {
    commit('setWindowInfo', windowInfo);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
