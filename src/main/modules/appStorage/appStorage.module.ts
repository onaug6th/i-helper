import { App } from 'electron';
import appStorageService from './appStorage.service';

export default {
  init(app: App): void {
    app;
    appStorageService.appOnReady();
  }
};
