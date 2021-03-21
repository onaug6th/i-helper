/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import settings from 'electron-settings';

//  设置数据
let settingData: any = {};

/**
 * 设置默认设置
 * @returns
 */
function setDefaultSetting() {
  const defaultSetting = {
    shortcutKey: {
      open: 'Ctrl+Space'
    }
  };
  settings.setSync(defaultSetting);
  return defaultSetting;
}

/**
 * 获取配置
 * @param type
 * @returns { Promise }
 */
async function getSetting(type: string): Promise<any> {
  return settingData[type];
}

/**
 * 设置配置
 * @param path
 * @param value
 */
async function setSetting(path: string, value: any): Promise<void> {
  settings.setSync(path, value);
}

/**
 * 获取最新的全部设置
 */
async function getNewestAllSetting(): Promise<any> {
  settingData = settings.getSync();

  if (!Object.keys(settingData).length) {
    settingData = setDefaultSetting();
  }

  return settingData;
}

getNewestAllSetting();

export { getSetting, setSetting, getNewestAllSetting, settingData };
