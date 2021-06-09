import { ipcMain } from 'electron';
import shortcutKeyService from './shortcutKey.service';

//  更新快捷键
ipcMain.handle('shortcutKey-update', (event, result) => {
  const { type, key } = result;

  return shortcutKeyService.shortcutKeyUpdate(type, key);
});
