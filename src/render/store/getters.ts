/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getters = {
  currentWindow: (state: any) => state.app.currentWindow,
  windowId: (state: any) => state.app.currentWindow.id,
  version: (state: any) => state.app.version,
  mainWindowId: (state: any) => state.app.mainWindowId,
  setting: (state: any) => state.app.setting,
  shortcutKey: (state: any) => state.app.shortcutKey,
  user: (state: any) => state.app.user,
  userId: (state: any) => state.app.user.userId
};
export default getters;
