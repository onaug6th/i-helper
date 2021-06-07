import { App } from 'electron';
import devManage from './dev.controller';
import './dev.service';

export default {
  init(app: App): void {
    app;
    devManage.appOnReady();
  }
};
