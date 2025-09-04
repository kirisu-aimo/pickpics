import { ElectronHandler } from '../main/preload';

export interface pathObject {
  [key: string]: string[];
}

export interface IElectronAPI {
  menuOpen: (
    listener: (
      _e: Electron.IpcRendererEvent,
      dirPath: string,
      filepaths: string[],
    ) => void,
  ) => Electron.IpcRenderer;
  getDirPath: () => string;
  getImgsPath: (dirPaths: string[]) => pathObject;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    myAPI: IElectronAPI;
  }
}

export {};
