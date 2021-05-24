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
          title: '插件列表'
        }
      },
      {
        path: '/dev',
        name: 'dev',
        component: () => import('../views/main/dev/index.vue'),
        meta: {
          title: '开发者模式'
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
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
