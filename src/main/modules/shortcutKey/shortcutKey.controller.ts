import { ipcMain } from 'electron';
import shortcutKeyService from './shortcutKey.service';

//  更新快捷键
ipcMain.handle('shortcutKey-get', () => {
  return shortcutKeyService.shortcutKey;
});

//  更新快捷键
ipcMain.handle('shortcutKey-update', (event, data) => {
  const { type, key } = data;

  return shortcutKeyService.shortcutKeyUpdate(type, key);
});
