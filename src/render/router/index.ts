import { createRouter, createWebHashHistory } from 'vue-router';
import { RouteRecordRaw } from 'vue-router';
import main from '../views/main/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    redirect: 'miniAppList',
    component: main,
    children: [
      {
        path: '/miniAppList',
        name: 'miniAppList',
        component: () => import('../views/main/miniAppList/index.vue'),
        meta: {
          title: '应用'
        }
      },
      {
        path: '/notes',
        name: 'notes',
        component: () => import('../views/main/notes/index.vue'),
        meta: {
          title: '笔记'
        }
      },
      {
        path: '/clipboard',
        name: 'clipboard',
        component: () => import('../views/main/clipboard/index.vue'),
        meta: {
          title: '剪贴板'
        }
      },
      {
        path: '/notices',
        name: 'notices',
        component: () => import('../views/main/notices/index.vue'),
        meta: {
          title: '提醒'
        }
      },
      {
        path: '/todo',
        name: 'todo',
        component: () => import('../views/main/todo/index.vue'),
        meta: {
          title: '待办事项'
        }
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/main/setting/index.vue'),
        meta: {
          title: '设置'
        },
        children: [
          {
            path: 'common',
            component: () => import('../views/main/setting/common/index.vue')
          },
          {
            path: 'shortcutKey',
            component: () => import('../views/main/setting/shortcutKey/index.vue')
          }
        ]
      }
    ]
  },

  {
    path: '/miniApp',
    name: 'miniApp',
    component: () => import('../views/miniApp/index.vue'),
    meta: {
      title: '小程序'
    }
  },

  {
    path: '/note',
    name: 'note',
    component: () => import('../views/note/index.vue'),
    meta: {
      title: '便笺'
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
