import { ipcRenderer } from 'electron';
import { ElNotification, ElLoading } from 'element-plus';

let loading;

/**
 * ipcClientLoading
 * @param event
 * @param args
 * @returns
 */
async function ipcClientLoading(showLoading: boolean, ...args: Array<any>): Promise<any> {
  if (showLoading) {
    loading = ElLoading.service();
  }

  let result;
  try {
    const [event, ...eventArgs] = args;
    result = await ipcRenderer.invoke(event, ...eventArgs);
  } catch (error) {
    const message = error.message
      .split(':')
      .pop()
      .trim();

    ElNotification({
      type: 'error',
      message
    });
    throw Error(error);
  } finally {
    if (showLoading) {
      loading.close();
    }
  }
  return result;
}

const ipcClient = {
  normal: (...args): Promise<any> => ipcClientLoading(false, ...args),
  ipcClientLoading: (...args): Promise<any> => ipcClientLoading(true, ...args)
};

export default ipcClient;
