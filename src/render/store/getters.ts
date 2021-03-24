/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getters = {
  windowId: (state: any) => state.app.windowId,
  mainWindowId: (state: any) => state.app.mainWindowId,
  setting: (state: any) => state.app.setting
};
export default getters;
