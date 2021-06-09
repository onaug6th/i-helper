import { App } from 'electron';
import shortcutKeyService from './shortcutKey.service';
import './shortcutKey.controller';

export default {
  init(app: App): void {
    app;
    shortcutKeyService.appOnReady();
  }
};
