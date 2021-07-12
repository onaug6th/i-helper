import { createApp } from 'vue';
import App from './App.vue';
import store from './render/store';
import router from './render/router';

import mitt from 'mitt';
import ipcClient from './render/ipcClient';

import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
VMdPreview.use(githubTheme, {
  Hljs: hljs
});

const app = createApp(App);

// app.config.errorHandler = (...args) => {
//   console.info(...args);
// };

app
  .use(ElementPlus)
  .use(router)
  .use(store)
  .use(VMdPreview)
  .mount('#app');

app.config.globalProperties.$eventBus = mitt();
app.config.globalProperties.$ipcClient = ipcClient.normal;
app.config.globalProperties.$ipcClientLoading = ipcClient.ipcClientLoading;
app.config.globalProperties.$ipcClientOn = ipcClient.on;
