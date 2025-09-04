// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};
const menuOpen = (
  listener: (
    _e: IpcRendererEvent,
    dirPath: string,
    filepaths: string[],
  ) => void,
) => {
  // 'menu-open' チャンネルへ受信
  ipcRenderer.on('menu-open', listener);
  return () => ipcRenderer.off('menu-open', listener);
};

const getFilepathsinDirectory = (
  listener: (_e: IpcRendererEvent, dirPath: string) => void,
) => {
  ipcRenderer.on('getFilepathsinDirectory', listener);
};

contextBridge.exposeInMainWorld('electron', electronHandler);

contextBridge.exposeInMainWorld('myAPI', {
  menuOpen,
  getDirPath: () => ipcRenderer.invoke('get-dir-path'),
  getImgsPath: (dirPaths: string[]) =>
    ipcRenderer.invoke('get-imgs-path', dirPaths),
});

export type ElectronHandler = typeof electronHandler;
