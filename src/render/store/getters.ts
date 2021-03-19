/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const getters = {
  windowId: (state: any) => state.app.windowInfo.windowId,
  mainWindowId: (state: any) => state.app.mainWindowId
};
export default getters;
