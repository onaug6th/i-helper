const state = {
  menuList: [
    {
      label: '笔记',
      path: 'notes',
      icon: 'edit'
    },
    {
      label: '剪贴板',
      path: 'clipboard',
      icon: 'document'
    },
    {
      label: '提醒',
      path: 'notices',
      icon: 'bell'
    },
    {
      label: '待办事项',
      path: 'todo',
      icon: 'date'
    }
  ],
  size: 'medium'
};

const mutations = {
  setMenuList: (state: { menuList: any }, menuList: any) => {
    state.menuList = menuList;
  }
};

const actions = {
  setMenuList({ commit }: any, menuList: any) {
    commit('setMenuList', menuList);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
