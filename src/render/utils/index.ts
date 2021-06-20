type FunctionalControl = (this: any, fn: any, delay?: number) => (...args: any) => void;
type DebounceEvent = FunctionalControl;
type ThrottleEvent = FunctionalControl;

/**
 * 防抖函数
 * @param fn
 * @param delay
 * @returns
 */
export const debounce: DebounceEvent = function(fn, delay = 1000) {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param fn
 * @param delay
 * @returns
 */
export const throttle: ThrottleEvent = function(fn, delay = 500) {
  let flag = true;
  return (...args: any) => {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
};

/**
 * uuid
 * @returns
 */
export const uuid = (): string => {
  const str = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return str() + str() + '-' + str() + '-' + str() + '-' + str() + '-' + str() + str() + str();
};

/**
 * 安全设置对象的值
 * @param {*} target 目标对象
 * @param {*} path 路径
 * @param {*} value 值
 */
export function safeSet(target: unknown, path: string, value: unknown): void {
  path.split('.').reduce((prev, attr, index, arr) => {
    const isLast = index === arr.length - 1;
    if (!isLast && prev[attr] && Object.prototype.toString.call(prev[attr]) !== '[object Object]') {
      console.error('你这个已存在的属性不是对象啊');
      return '';
    }

    if (isLast) {
      prev[attr] = value;
      return prev[attr];
    }
    prev[attr] ? prev[attr] : (prev[attr] = {});
    return prev[attr];
  }, target);
}

/**
 * 安全地获取嵌套对象的属性
 * 特别注意：为了简化判断流程，undefined 和 null 均返回 undefined
 * @param {object} target - 目标对象
 * @param {string} path - 属性路径
 * @param {any} defaultValue - 默认值
 * @return {any} 目标属性
 */
export function safeGet(target: unknown, path: string, defaultValue: unknown = ''): any {
  //  判断是否为无值，即 undefined 或者 null
  const isNil = value => value === null || value === undefined;
  const value = path
    .split('.')
    .reduce((last, key) => (key && last && !isNil(last[key]) ? last[key] : undefined), target);

  return isNil(value) ? defaultValue : value;
}

/**
 * 获取路径地址的最后一位
 * @param path
 * @returns
 */
export function getLastPath(path: string): string {
  const pathArr = path.split('\\');
  return pathArr[pathArr.length - 1];
}

/**
 * 字节转换
 * @param bytes
 * @returns
 */
export function byteConvert(bytes: number): string {
  if (isNaN(bytes)) {
    return '';
  }
  const symbols = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let exp = Math.floor(Math.log(bytes) / Math.log(2));
  const biteIndex = Math.floor(exp / 10);
  if (exp < 1) {
    exp = 0;
  }
  bytes = bytes / Math.pow(2, 10 * biteIndex);
  let r;
  if (bytes.toString().length > bytes.toFixed(2).toString().length) {
    r = bytes.toFixed(1);
  }
  return r + symbols[biteIndex];
}
