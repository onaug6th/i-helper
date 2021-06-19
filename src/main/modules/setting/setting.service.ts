import appStorageService from '@/main/modules/appStorage/appStorage.service';
class SettingService {
  storageName = 'setting';

  /**
   * 默认设置
   * @private
   * @type {*}
   * @memberof settingService
   */
  settingData: any = {};

  /**
   * 应用初始化时执行
   * @param app
   */
  async appOnReady(app) {
    this.settingData = appStorageService.getData(this.storageName);

    app.setLoginItemSettings({
      //  开机启动
      openAtLogin: this.settingData.openAtLogin,
      //  开机启动时为隐藏启动
      openAsHidden: true
    });
  }

  /**
   * 注册应用储存初始化的数据
   */
  register() {
    return {
      [this.storageName]: {
        openAtLogin: false,
        isAlwaysOnTop: false
      }
    };
  }

  /**
   * 更新设置内容
   * @param type
   * @param val
   */
  update(type: string, val: any) {
    //  更新内存中的设置值
    this.settingData[type] = val;
    appStorageService.setData(`${this.storageName}.${type}`, val);
  }
}

export default new SettingService();
