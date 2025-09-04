import React, { useState } from 'react';
import Main from './components/Main';
import TitleBar from './components/TitleBar';

interface pathObject {
  [key: string]: string[];
}
// interface DetailViewerState {
//   origin: { x: number; y: number };
//   scale: number;
//   mirror: { x: boolean; y: boolean };
// }

export default function HomeScreen() {
  const [paths, setPaths] = useState<pathObject>({});
  // const [reloadController, setReloadController] = useState<boolean>(false);

  window.myAPI.menuOpen((_e, dirPath, filepaths) => {
    const newpaths = { ...paths };
    newpaths[dirPath] = filepaths;
    setPaths(newpaths);
  });

  const openDirectory = async () => {
    const dirPath = await window.myAPI.getDirPath();
    if (dirPath) {
      const newKeys = paths;
      newKeys[dirPath] = [];
      setPaths(newKeys);
    }
  };

  const loadImgPaths = async () => {
    const newPaths = await window.myAPI.getImgsPath(Object.keys(paths));
    // setReloadController((prev) => prev!);
    setPaths(newPaths);
  };
  const deleteDirPath = async (dirPath: string) => {
    const newPaths = paths;
    delete newPaths[dirPath];
    setPaths(newPaths);
    await loadImgPaths();
  };
  const onClickOpen = async () => {
    await openDirectory();
    await loadImgPaths();
  };

  return (
    <div>
      <TitleBar onClickOpen={onClickOpen} />
      <Main paths={paths} onReload={loadImgPaths} onDelete={deleteDirPath} />
    </div>
  );
}
