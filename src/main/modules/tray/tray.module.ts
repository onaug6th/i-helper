import { App } from 'electron';
import trayService from './tray.service';

export default {
  init(app: App): void {
    app;
    trayService.appOnReady();
  }
};
