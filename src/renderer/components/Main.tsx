import React, { useState } from 'react';
import MasonryContainer from './MasonryContainer';
import DetailViewer from './DetailViewer';
// import { v4 as uuidv4 } from 'uuid';
// import path from 'path';

interface pathObject {
  [key: string]: string[];
}
interface DetailViewerState {
  origin: { x: number; y: number };
  scale: number;
  mirror: { x: boolean; y: boolean };
}

interface Props {
  paths: pathObject;
  onReload: () => void;
  onDelete: (dirPath: string) => void;
  // reloadController: boolean;
}

export default function Main({
  paths,
  onReload,
  onDelete,
  // reloadController,
}: Props) {
  const encodeURI = (str: string) => {
    return str
      .replace(/%/g, '%25')
      .replace(/#/g, '%23')
      .replace(/\?/g, '%3F')
      .replace(/ /g, '%20');
  };

  // DetailViewer
  const [isOpenDetailViewer, setIsOpenDetailViewer] = useState<boolean>(false);
  const [detailViewerPath, setDetailViewerPath] = useState<string>('');
  const [detailViewerState, setDetailViewerState] = useState<DetailViewerState>(
    {
      origin: { x: 0, y: 0 },
      scale: 1,
      mirror: { x: false, y: false },
    },
  );

  const imageClickHandle = (path: string) => () => {
    setIsOpenDetailViewer(true);
    setDetailViewerPath(path);
    // Reset DetailViewer states
    setDetailViewerState({
      origin: { x: 0, y: 0 },
      scale: 1,
      mirror: { x: false, y: false },
    });
  };

  const onCloseViewer = () => {
    setIsOpenDetailViewer(false);
    setDetailViewerPath('');
  };

  const onKeyDown =
    (path: string) => (event: React.KeyboardEvent<HTMLImageElement>) => {
      if (event.key === 'Enter') {
        imageClickHandle(path)();
      }
      if (event.key === 'Escape') {
        onCloseViewer();
      }
    };

  // window.addEventListener('keydown', (e) => {
  //   if (e.key === 'F5') {
  //     window.location.reload();
  //   }
  //   if (e.key === 'escape') {
  //     setIsOpenDetailViewer(false);
  //     setDetailViewerPath('');
  //   }
  // });

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid #000',
        width: '100%',
      }}
    >
      {Object.keys(paths).map((dirPath) => (
        <div
          key={dirPath}
          style={{
            height: '20px',
            display: 'flex',
            flexDirection: 'row',
            padding: '3px 10px',
            alignItems: 'center',
            borderBottom: '1px solid #000',
          }}
        >
          <ol className="breadcrumb">
            {dirPath
              .split('\\')
              .filter((_, index, array) => index > array.length - 4)
              .map((path) => (
                <li className="breadcrumb-item" key={path}>
                  {path}
                </li>
              ))}
          </ol>
          <button
            type="button"
            onClick={onReload}
            style={{ marginLeft: 'auto' }}
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete(dirPath);
              onCloseViewer();
            }}
          >
            Close
          </button>
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
            flex: '0 0 auto',
            overflowY: 'scroll',
            scrollbarColor: '#555 transparent',
            scrollbarWidth: isOpenDetailViewer ? 'thin' : 'auto',
            borderRight: isOpenDetailViewer ? '1px solid #000' : 'none',
            height: '100%',
          }}
        >
          <MasonryContainer
            // reloadController={reloadController}
            optimalWidth={100}
            gap={10}
          >
            {Object.values(paths)
              .flat()
              .map((file, index) => (
                <div
                  className="masonry-card"
                  role="button"
                  onClick={imageClickHandle(file)}
                  onKeyDown={onKeyDown(file)}
                  tabIndex={index + 1}
                  key={file}
                  style={{
                    cursor: 'pointer',
                    width: '100%',
                    height: 'auto',
                    background: '#353535',
                    borderRadius: '10px',
                  }}
                >
                  <img
                    className="masonry-card-img"
                    src={`file://${encodeURI(file)}`}
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
              background: '#222',
              width: '0%',
              flex: '1 1 auto',
            }}
          >
            <div
              style={{
                width: 'auto',
                flexDirection: 'row',
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #000',
                height: '30px',
              }}
            >
              <div
                style={{
                  minWidth: '0',
                  flex: '1 1 auto',
                  color: '#888',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {detailViewerPath.replace(/.*\\/, '')}
              </div>
              <button
                type="button"
                onClick={onCloseViewer}
                style={{ width: 'auto', height: '80%', flex: '0 0 auto' }}
              >
                Exit
              </button>
            </div>
            <DetailViewer
              path={`file://${encodeURI(detailViewerPath)}`}
              onClose={setIsOpenDetailViewer}
              detailViewerState={detailViewerState}
              setDetailViewerState={setDetailViewerState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
