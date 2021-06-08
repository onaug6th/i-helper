import { baseURL } from '@/main/constants/url';
import axios, { AxiosRequestConfig } from 'axios';

axios.defaults.baseURL = baseURL;

const http: any = async function(url: string, options: AxiosRequestConfig): Promise<any> {
  return axios({
    url,
    ...options
  });
};

['get', 'delete', 'head', 'post', 'put', 'patch', 'purge', 'link', 'unlink'].forEach(method => {
  http[method] = function(url, options) {
    return http(url, { ...options, method });
  };
});

axios.interceptors.request.use(config => {
  return config;
});

export default http;
