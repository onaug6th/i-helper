import settings from 'electron-settings';

class SettingManage {
  /**
   * 私有的设置数据
   *
   * @private
   * @type {*}
   * @memberof SettingManage
   */
  settingData: any = {
    common: {
      openAtLogin: true,
      isAlwaysOnTop: true
    },
    shortcutKey: {
      open: 'Ctrl+Space'
    }
  };

  /**
   * 应用初始化时执行
   * @param app
   */
  async appOnReady(app) {
    await this.getNewestAllSetting();

    app.setLoginItemSettings({
      openAtLogin: this.settingData.common.openAtLogin,
      openAsHidden: true
    });
  }

  /**
   * 设置默认设置
   * @returns
   */
  async setDefaultSetting() {
    settings.setSync(this.settingData);
    return this.settingData;
  }

  /**
   * 获取配置
   * @param type
   * @returns { Promise }
   */
  getSetting(type: string): Promise<any> {
    return this.settingData[type];
  }

  /**
   * 设置配置
   * @param path
   * @param value
   */
  async setSetting(path: string, value: any): Promise<void> {
    settings.setSync(path, value);
    this.getNewestAllSetting();
  }

  /**
   * 获取最新的全部设置
   */
  async getNewestAllSetting(): Promise<void> {
    const allSetting = settings.getSync();

    //  存在配置数据
    if (Object.keys(allSetting).length) {
      this.settingData = allSetting;
    }
    //  不存在，说明首次初始化
    else {
      this.settingData = await this.setDefaultSetting();
    }
  }
}

export default new SettingManage();
