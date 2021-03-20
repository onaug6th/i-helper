import settings from 'electron-settings';

let settingData = {};

/**
 * 获取配置
 * @param type
 * @returns { Promise }
 */
async function getSetting(type: string): Promise<any> {
  return settingData[type];
}

/**
 * 获取最新的全部设置
 */
async function getNewestAllSetting(): Promise<any> {
  settingData = settings.getSync();
  return settingData;
}

getNewestAllSetting();

export { getSetting, getNewestAllSetting };
