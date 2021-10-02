import {
  compareVersion,
  debounce,
  throttle,
  uuid,
  safeSet,
  safeGet,
  byteConvert,
  getFileExtra,
  obj2Query,
  query2Obj
} from '@/utils';

/**
 * 检查最新应用版本
 * @param val
 * @param type
 */
async function checkLatestVersion(proxy: any | unknown, openWin = true): Promise<boolean> {
  const { canUpdate } = await proxy.$ipcClientLoading('update-check-release', openWin);

  return canUpdate;
}

export {
  compareVersion,
  debounce,
  throttle,
  uuid,
  safeSet,
  safeGet,
  byteConvert,
  getFileExtra,
  obj2Query,
  query2Obj,
  checkLatestVersion
};
