import { App } from 'electron';
import userService from './user.service';
import './user.controller';

export default {
  init(app: App): void {
    app;
    userService.appOnReady();
  }
};
