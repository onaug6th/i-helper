import { reactive, watch } from 'vue';

/**
 *
 * @param storeName
 * @param storeData
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function reactiveStorage(storeName: string, storeData: any) {
  //    localStorage名称
  const storegeName = `store-${storeName}`;
  //    localStorage数据
  const storageData = localStorage.getItem(storegeName);

  if (storageData) {
    storeData = reactive(JSON.parse(storageData));
  } else {
    storeData = reactive(storeData);
    localStorage.setItem(storegeName, JSON.stringify(storeData));
  }

  watch(storeData, e => {
    localStorage.setItem(storegeName, JSON.stringify(e));
  });

  return storeData;
}
export { reactiveStorage };
