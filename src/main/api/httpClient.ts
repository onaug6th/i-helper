import axios, { AxiosRequestConfig } from 'axios';
import { ElNotification } from 'element-plus';
import { baseURL } from '@/main/constants/url';
import { safeGet } from '@/render/utils';

axios.defaults.baseURL = baseURL;

const httpClient: any = async function(url: string, options: AxiosRequestConfig): Promise<any> {
  return axios({
    url,
    ...options
  });
};

['get', 'delete', 'head', 'post', 'put', 'patch', 'purge', 'link', 'unlink'].forEach(method => {
  httpClient[method] = function(url, options) {
    return httpClient(url, { ...options, method });
  };
});

axios.interceptors.request.use(config => {
  return config;
});

axios.interceptors.response.use(
  response => {
    if (response.config.url.includes('ihelper.instarry')) {
      const {
        data: { success, msg, data }
      } = response;

      if (!success) {
        throw new Error(msg);
      }

      return data;
    } else {
      return response.data;
    }
  },
  error => {
    const { response } = error;
    const msg = safeGet(response, 'response.data.data.msg');
    if (msg) {
      ElNotification({
        type: 'error',
        message: msg
      });
      throw new Error(response);
    }
  }
);

export default httpClient;
