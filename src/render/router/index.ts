import { createRouter, createWebHashHistory } from 'vue-router';
import { RouteRecordRaw } from 'vue-router';
import main from '../views/main/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    redirect: 'pluginList',
    component: main,
    children: [
      {
        path: '/pluginList',
        name: 'pluginList',
        component: () => import('../views/main/pluginList/index.vue'),
        meta: {
          title: '应用'
        }
      },
      {
        path: '/dev',
        name: 'dev',
        component: () => import('../views/main/dev/index.vue'),
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
    path: '/plugin',
    name: 'plugin',
    component: () => import('../views/plugin/index.vue'),
    meta: {
      title: '插件'
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
