import { ipcMain } from 'electron';
import shortcutKeyManage from '@/main/core/shortcutKey/shortcutKeyManage';

//  获取快捷键
ipcMain.handle('shortcutKey-get', () => {
  return shortcutKeyManage.shortcutKeyGet();
});

//  更新快捷键
ipcMain.handle('shortcutKey-update', (event, result) => {
  const { type, key } = result;

  return shortcutKeyManage.shortcutKeyUpdate(type, key);
});
