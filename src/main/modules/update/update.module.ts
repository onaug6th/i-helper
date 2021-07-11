import { App } from 'electron';
import updateService from './update.service';
import './update.controller';

export default {
  init(app: App): void {
    app;
    updateService.appOnReady();
  }
};
