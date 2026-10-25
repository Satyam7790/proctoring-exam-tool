import { contextBridge, ipcRenderer } from 'electron';

const desktop = {
  desktopInfo: () => ipcRenderer.invoke('verity:desktop-info') as Promise<{ platform: string; version: string; packaged: boolean }>,
  setExamFullscreen: (enabled: boolean) => ipcRenderer.invoke('verity:set-fullscreen', enabled) as Promise<boolean>,
  getScreenSources: () => ipcRenderer.invoke('verity:screen-sources') as Promise<Array<{ id: string; name: string; thumbnail: string }>>,
  onWindowFocus: (callback: (focused: boolean) => void) => {
    if (typeof callback !== 'function') throw new TypeError('Callback required');
    const listener = (_event: Electron.IpcRendererEvent, focused: unknown) => { if (typeof focused === 'boolean') callback(focused); };
    ipcRenderer.on('verity:window-focus', listener);
    return () => ipcRenderer.removeListener('verity:window-focus', listener);
  },
};
contextBridge.exposeInMainWorld('verity', desktop);
