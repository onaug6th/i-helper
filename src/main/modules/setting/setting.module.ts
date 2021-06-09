import { App } from 'electron';
import settingService from './setting.service';
import './setting.controller';

export default {
  init(app: App): void {
    settingService.appOnReady(app);
  }
};
