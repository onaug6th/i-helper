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
