import { AxiosRequestConfig } from 'axios';

export type HttpMethod = <T>(url: string, options?: AxiosRequestConfig) => Promise<T>;

export interface Http {
  get?: HttpMethod;
  post?: HttpMethod;
  delete?: HttpMethod;
  update?: HttpMethod;
  put?: HttpMethod;
}

// 请求接口数据
export interface ResponseData<T = any> {
  /**
   * 状态码
   * @type { boolean }
   */
  success: boolean;

  /**
   * 数据
   * @type { T }
   */
  data: T;

  /**
   * 消息
   * @type { string | null }
   */
  msg: string | null;

  /**
   * 状态码
   * @type { string }
   */
  statusCode: number;
}
