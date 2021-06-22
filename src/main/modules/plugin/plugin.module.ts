import { App } from 'electron';
import pluginService from './plugin.service';
import './plugin.controller';

export default {
  async init(app: App): Promise<void> {
    await pluginService.appOnReady(app);
  }
};
