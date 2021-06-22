import { App } from 'electron';
import devService from './dev.service';
import './dev.controller';

export default {
  async init(app: App): Promise<void> {
    app;
    await devService.appOnReady();
  }
};
