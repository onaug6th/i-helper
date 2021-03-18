import { ipcMain } from 'electron';

ipcMain.handle('shortcut-get', () => {
  return {
    open: 'Ctrl + Z'
  };
});

//  更新快捷键
ipcMain.on('shortcut-update', (event, result) => {
  const { type, shortcut } = result;
  type;
  shortcut;
});
