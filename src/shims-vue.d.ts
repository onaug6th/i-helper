/* eslint-disable @typescript-eslint/ban-types */
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare type Nullable<T> = T | null;

/**
 * 剪贴板项
 */
interface DBClipboard {
  type: string;
  value: any;
  star: boolean;
  readonly createdAt: Date;
  readonly uid: string;
  readonly updatedAt: Date;
  readonly _id: string;
}
