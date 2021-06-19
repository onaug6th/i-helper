import settings from 'electron-settings';
import settingService from '../setting/setting.service';
import shortcutKeyService from '../shortcutKey/shortcutKey.service';

class AppStorageService {
  /**
   * 内存数据
   */
  data: any = {};

  /**
   * 应用初始化时执行
   */
  async appOnReady() {
    this.setAppStorage();
  }

  /**
   * 设置默认应用数据
   */
  setDefaultData() {
    const defaultData = {
      ...shortcutKeyService.register(),
      ...settingService.register()
    };

    settings.setSync(defaultData);
    return defaultData;
  }

  /**
   * 设置应用储存数据
   */
  setAppStorage(): void {
    const allSetting = settings.getSync();

    //  存在配置数据
    if (Object.keys(allSetting).length) {
      this.data = allSetting;
    }
    //  不存在，设置默认应用数据
    else {
      this.data = this.setDefaultData();
    }
  }

  /**
   * 获取配置
   * @param storageName
   */
  getData(storageName: string) {
    return this.data[storageName];
  }

  /**
   * 设置配置
   * @param path
   * @param value
   */
  setData(path: string, value: any): void {
    settings.setSync(path, value);
    this.setAppStorage();
  }
}

export default new AppStorageService();
