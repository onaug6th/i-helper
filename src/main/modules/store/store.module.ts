import { App } from 'electron';
import storeService from './store.service';
import './store.controller';

export default {
  async init(app: App): Promise<void> {
    app;
    await storeService.appOnReady();
  }
};
