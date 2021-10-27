import axios, { AxiosRequestConfig, Method } from 'axios';
import { baseURL } from '@/main/constants/url';
import { safeGet } from '@/main/utils';
import { ResponseData, Http, HttpMethod } from './types';

axios.defaults.baseURL = baseURL;

const axiosInstance = axios.create({
  baseURL
});

axiosInstance.interceptors.request.use(config => {
  return config;
});

axiosInstance.interceptors.response.use(
  response => {
    const url = response.config.url;
    if (url.includes('ihelper.instarry') || url.includes('localhost')) {
      const responseData: ResponseData = response.data;
      const { success, msg, data } = responseData;

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
    const msg = safeGet(response, 'data.msg');
    if (msg) {
      throw new Error(msg);
    }
  }
);

const httpClient: Http = {};

const httpCoreFn: HttpMethod = async <T>(url: string, options?: AxiosRequestConfig): Promise<T> => {
  const result = await axiosInstance({
    url,
    ...options
  });

  return (result as unknown) as T;
};

['get', 'post', 'delete', 'update', 'put'].forEach((method: Method) => {
  httpClient[method] = <T>(url: string, options?: AxiosRequestConfig) => httpCoreFn<T>(url, options);
});

export default httpClient;
