import { App } from 'electron';
import settingManage from './setting.controller';
import './setting.service';

export default {
  init(app: App): void {
    settingManage.appOnReady(app);
  }
};
