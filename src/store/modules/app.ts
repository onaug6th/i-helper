const state = {
  device: 'desktop',
  size: 'medium'
};

const mutations = {
  toggleDevice: (state: { device: any }, device: any) => {
    state.device = device;
  },
  setSize: (state: { size: any }, size: any) => {
    state.size = size;
  }
};

const actions = {
  toggleDevice({ commit }: any, device: any) {
    commit('toggleDevice', device);
  },
  setSize({ commit }: any, size: any) {
    commit('setSize', size);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
