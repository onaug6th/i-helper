import { createRouter, createWebHashHistory } from 'vue-router';
import { RouteRecordRaw } from 'vue-router';
import home from '../views/home/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: 'notes',
    component: home,
    children: [
      {
        path: '/notes',
        name: 'notes',
        component: () => import('../views/notes/index.vue'),
        meta: {
          title: '笔记'
        }
      },
      {
        path: '/note',
        name: 'note',
        component: () => import('../views/note/index.vue'),
        meta: {
          title: '便笺'
        }
      },
      {
        path: '/clipboard',
        name: 'clipboard',
        component: () => import('../views/clipboard/index.vue'),
        meta: {
          title: '剪贴板'
        }
      },
      {
        path: '/notices',
        name: 'notices',
        component: () => import('../views/notices/index.vue'),
        meta: {
          title: '提醒'
        }
      },
      {
        path: '/todo',
        name: 'todo',
        component: () => import('../views/todo/index.vue'),
        meta: {
          title: '待办事项'
        }
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/setting/index.vue'),
        meta: {
          title: '设置'
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
