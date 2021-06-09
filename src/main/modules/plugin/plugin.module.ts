import { App } from 'electron';
import pluginService from './plugin.service';
import './plugin.controller';

export default {
  init(app: App): void {
    pluginService.appOnReady(app);
  }
};
