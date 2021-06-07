import { App } from 'electron';
import pluginManage from './plugin.controller';
import './plugin.service';

export default {
  init(app: App): void {
    pluginManage.appOnReady(app);
  }
};
