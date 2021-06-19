/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getters = {
  currentWindow: (state: any) => state.app.currentWindow,
  windowId: (state: any) => state.app.currentWindow.id,
  mainWindowId: (state: any) => state.app.mainWindowId,
  setting: (state: any) => state.app.setting,
  shortcutKey: (state: any) => state.app.shortcutKey
};
export default getters;
