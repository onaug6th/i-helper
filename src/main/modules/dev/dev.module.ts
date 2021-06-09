import { App } from 'electron';
import devService from './dev.service';
import './dev.controller';

export default {
  init(app: App): void {
    app;
    devService.appOnReady();
  }
};
