import { App } from 'electron';
import trayManage from './tray.controller';

export default {
  init(app: App): void {
    app;
    trayManage.appOnReady();
  }
};
