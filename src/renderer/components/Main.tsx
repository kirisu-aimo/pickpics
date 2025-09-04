import React, { useRef, useState } from 'react';
import MasonryContainer from './MasonryContainer';
import DetailViewer from './DetailViewer';
import DetailViewerHeader from './DetailViewerHeader';
import BreadCrumb from './BreadCrumb';
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
  const masonryContainerWrapperRef = useRef<HTMLDivElement>(null!);

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

  return (
    <div
      className="main-wrapper"
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
        <BreadCrumb
          dirPath={dirPath}
          onCloseViewer={onCloseViewer}
          onDelete={onDelete}
          onReload={onReload}
        />
      ))}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <div
          ref={masonryContainerWrapperRef}
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
          <MasonryContainer optimalWidth={150} gap={10}>
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
            <DetailViewerHeader
              onCloseViewer={onCloseViewer}
              detailViewerPath={detailViewerPath}
            />
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
