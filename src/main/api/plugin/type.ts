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

//  插件列表
export type PluginList = Array<{
  authorId: string;
  authorName: string;
  createTime: string;
  desc: string;
  downloads: number;
  fileUrl: string;
  id: string;
  logo: string;
  name: string;
  rate: number;
  rateTimes: number;
  rateTotal: number;
  readmeContent: string;
  size: number;
  sizeFormat: string;
  version: string;
}>;

//  版本号列表
export type Releases = Array<{
  id: number;
  tag_name: string;
  target_commitish: string;
  prerelease: boolean;
  name: string;
  body: string;
  author: {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    url: string;
    html_url: string;
    remark: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
  };
  created_at: string;
  assets: [
    {
      browser_download_url: string;
      name?: string;
    }
  ];
}>;
