import React, { useState } from 'react';
import MasonryContainer from './components/MasonryContainer';
import DetailViewer from './components/DetailViewer';
// import path from 'path';

interface pathObject {
  [key: string]: string[];
}

export default function HomeScreen() {
  const [paths, setPaths] = useState<pathObject>({});
  // const [isneedReload, setIsneedReload] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [mirror, setMirror] = useState<{ x: boolean; y: boolean }>({
    x: false,
    y: false,
  });
  const [origin, setOrigin] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  window.myAPI.menuOpen((_e, dirPath, filepaths) => {
    const newpaths = { ...paths };
    newpaths[dirPath] = filepaths;
    setPaths(newpaths);
  });

  const [isOpenDetailViewer, setIsOpenDetailViewer] = useState<boolean>(false);
  const [detailViewerPath, setDetailViewerPath] = useState<string>('');

  const imageClickHandle = (path: string) => () => {
    setIsOpenDetailViewer(true);
    setDetailViewerPath(path);
    setScale(1);
    setOrigin({ x: 0, y: 0 });
    setMirror({ x: false, y: false });
  };

  const onKeyDown =
    (path: string) => (event: React.KeyboardEvent<HTMLImageElement>) => {
      if (event.key === 'Enter') {
        imageClickHandle(path)();
      }
      if (event.key === 'Escape') {
        setIsOpenDetailViewer(false);
        setDetailViewerPath('');
      }
    };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'F5') {
      window.location.reload();
    }
    if (e.key === 'escape') {
      setIsOpenDetailViewer(false);
      setDetailViewerPath('');
    }
  });
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {Object.keys(paths).map((dirPath) => (
        <div
          key={dirPath}
          style={{
            height: '12px',
            display: 'flex',
            flexDirection: 'row',
            padding: '3px 10px',
            alignItems: 'center',
            borderBottom: '1px solid #000',
          }}
        >
          {dirPath.split('\\').map((path, index) => (
            <div
              key={path}
              style={{
                color: '#888',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {index !== 0 && <div style={{ margin: '0 5px' }}> &gt; </div>}
              <div>{path}</div>
            </div>
          ))}
        </div>
      ))}
      <div
        style={{
          width: '100%',
          // height: '100%',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: isOpenDetailViewer ? '100px' : '100%',
            flexShrink: '0',
            overflowY: 'scroll',
            scrollbarColor: '#555 transparent',
            scrollbarWidth: isOpenDetailViewer ? 'thin' : 'auto',
            borderRight: isOpenDetailViewer ? '1px solid #000' : 'none',
            height: '100%',
          }}
        >
          <MasonryContainer optimalWidth={150} gap={10}>
            {Object.values(paths)
              .flat()
              .map((file, index) => (
                <div
                  className="masonry-card"
                  role="button"
                  onClick={imageClickHandle(file)}
                  onKeyDown={onKeyDown(file)}
                  tabIndex={index + 1000}
                  key={file}
                >
                  <img
                    src={`file://${file}`}
                    alt={file}
                    style={{
                      width: '100%',
                      display: 'block',
                      borderRadius: '10px',
                    }}
                  />
                </div>
              ))}
          </MasonryContainer>
        </div>
        {isOpenDetailViewer && (
          <div
            style={{
              // flexGrow: '1',
              flexGrow: '1',
              backgroundColor: '#222',
            }}
          >
            <div
              style={{
                height: '30px',
                color: '#888',
                padding: '5px 10px',
                alignItems: 'center',
                display: 'flex',
                borderBottom: '1px solid #000',
              }}
            >
              {detailViewerPath.replace(/.*\\/, '')}
            </div>
            <DetailViewer
              path={`file://${detailViewerPath}`}
              onClose={setIsOpenDetailViewer}
              mirror={mirror}
              setMirror={setMirror}
              scale={scale}
              setScale={setScale}
              origin={origin}
              setOrigin={setOrigin}
            />
          </div>
        )}
      </div>
    </div>
  );
}
