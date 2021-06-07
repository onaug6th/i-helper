import { App } from 'electron';
import shortcutKeyManage from './shortcutKey.controller';
import './shortcutKey.service';

export default {
  init(app: App): void {
    app;
    shortcutKeyManage.appOnReady();
  }
};
