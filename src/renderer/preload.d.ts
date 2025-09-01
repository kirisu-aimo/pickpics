import { ElectronHandler } from '../main/preload';

export interface IElectronAPI {
  menuOpen: (
    listener: (
      _e: Electron.IpcRendererEvent,
      dirPath: string,
      filepaths: string[],
    ) => void,
  ) => Electron.IpcRenderer;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    myAPI: IElectronAPI;
  }
}

export {};
