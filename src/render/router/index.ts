import { createRouter, createWebHashHistory } from 'vue-router';
import { RouteRecordRaw } from 'vue-router';
import main from '../views/main/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    redirect: 'installed',
    component: main,
    children: [
      {
        path: '/installed',
        name: 'installed',
        component: () => import('../views/main/installed/index.vue')
      },
      {
        path: '/store',
        name: 'store',
        component: () => import('../views/main/store/index.vue')
      },
      {
        path: '/dev',
        name: 'dev',
        component: () => import('../views/main/dev/index.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('../views/main/setting/index.vue'),
        children: [
          {
            path: 'common',
            component: () => import('../views/main/setting/common/index.vue')
          },
          {
            path: 'shortcutKey',
            component: () => import('../views/main/setting/shortcutKey/index.vue')
          },
          {
            path: 'about',
            component: () => import('../views/main/setting/about/index.vue')
          }
        ]
      }
    ]
  },

  {
    path: '/plugin',
    name: 'plugin',
    component: () => import('../views/plugin/index.vue')
  },

  {
    path: '/update',
    name: 'update',
    component: () => import('../views/update/index.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
