import { App } from 'electron';
import storeService from './store.service';
import './store.controller';

export default {
  init(app: App): void {
    app;
    storeService.appOnReady();
  }
};
