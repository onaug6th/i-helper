import { reactiveStorage } from './utils';

const app = reactiveStorage('app', {
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
    },
    {
      label: '设置',
      path: 'setting',
      icon: 'setting'
    }
  ]
});

export default app;
