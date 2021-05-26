import { createApp } from 'vue';
import App from './App.vue';
import store from './render/store';
import router from './render/router';
import ElementPlus from 'element-plus';
import mitt from 'mitt';
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App);

// app.config.errorHandler = (...args) => {
//   console.info(...args);
// };

app
  .use(ElementPlus)
  .use(router)
  .use(store)
  .mount('#app');

app.config.globalProperties.$eventBus = mitt();
