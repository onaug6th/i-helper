import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const app = createApp(App);

app.config.errorHandler = (...args) => {
  console.info(...args);
};

app
  .use(ElementPlus)
  .use(router)
  .use(store)
  .mount('#app');
