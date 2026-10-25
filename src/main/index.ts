import { app, BrowserWindow, ipcMain, desktopCapturer, session } from 'electron';
import { join } from 'node:path';

let win: BrowserWindow | null = null;
const allowedSender = (event: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent) => {
  const url = event.senderFrame?.url ?? '';
  return url.startsWith('file://') || (!app.isPackaged && url.startsWith('http://localhost:'));
};
function registerIpc() {
  ipcMain.handle('verity:desktop-info', event => {
    if (!allowedSender(event)) throw new Error('Untrusted IPC sender');
    return { platform: process.platform, version: app.getVersion(), packaged: app.isPackaged };
  });
  ipcMain.handle('verity:set-fullscreen', (event, value: unknown) => {
    if (!allowedSender(event) || typeof value !== 'boolean') throw new Error('Invalid fullscreen request');
    const target = BrowserWindow.fromWebContents(event.sender);
    target?.setFullScreen(value);
    return target?.isFullScreen() ?? false;
  });
  ipcMain.handle('verity:screen-sources', async event => {
    if (!allowedSender(event)) throw new Error('Untrusted IPC sender');
    const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 240, height: 140 } });
    return sources.map(source => ({ id: source.id, name: source.name, thumbnail: source.thumbnail.toDataURL() }));
  });
}
function createWindow() {
  win = new BrowserWindow({ width: 1420, height: 920, minWidth: 900, minHeight: 650, backgroundColor: '#0b1019', show: false,
    webPreferences: { preload: join(__dirname, '../preload/index.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true } });
  win.once('ready-to-show', () => win?.show());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, url) => {
    if (app.isPackaged ? !url.startsWith('file://') : !url.startsWith('http://localhost:')) event.preventDefault();
  });
  win.on('focus', () => win?.webContents.send('verity:window-focus', true));
  win.on('blur', () => win?.webContents.send('verity:window-focus', false));
  if (process.env.ELECTRON_RENDERER_URL) void win.loadURL(process.env.ELECTRON_RENDERER_URL);
  else void win.loadFile(join(__dirname, '../renderer/index.html'));
}
app.whenReady().then(() => {
  registerIpc();
  session.defaultSession.setPermissionRequestHandler((_contents, permission, callback, rawDetails) => {
    const permitted = ['media', 'display-capture'].includes(permission);
    const details = rawDetails as { mediaTypes?: string[] };
    callback(permitted && (details.mediaTypes?.length ?? 0) === 0 || permitted && (details.mediaTypes ?? []).every(type => ['audio', 'video'].includes(type)));
  });
  session.defaultSession.setPermissionCheckHandler((_contents, permission) => ['media', 'display-capture'].includes(permission));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
