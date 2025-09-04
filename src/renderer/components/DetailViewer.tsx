import React, { useState, useRef } from 'react';

interface DetailViewerState {
  origin: { x: number; y: number };
  scale: number;
  mirror: { x: boolean; y: boolean };
}
interface Props {
  path: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  detailViewerState: DetailViewerState;
  setDetailViewerState: React.Dispatch<React.SetStateAction<DetailViewerState>>;
  // scale: number;
  // setScale: React.Dispatch<React.SetStateAction<number>>;
  // mirror: { x: boolean; y: boolean };
  // setMirror: React.Dispatch<React.SetStateAction<{ x: boolean; y: boolean }>>;
  // origin: { x: number; y: number };
  // setOrigin: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export default function DetailViewer({
  path,
  onClose,
  detailViewerState,
  setDetailViewerState,
  // scale,
  // setScale,
  // mirror,
  // setMirror,
  // origin,
  // setOrigin,
}: Props) {
  type Coords = { x: number; y: number };
  const viewerRef = useRef<HTMLDivElement>(null!);
  const imgRef = useRef<HTMLImageElement>(null!);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isRightButton, setIsRightButton] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<Coords>({ x: 0, y: 0 });
  const [startDirection, setStartDirection] = useState<{
    x: boolean;
    y: boolean;
  }>({ x: false, y: false });

  const onMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    if (e.shiftKey) {
      setIsRightButton(true);
    }
    if (e.button === 2) {
      setIsRightButton(true);
    } else {
      setIsRightButton(false);
    }
    setStartPoint({ x: e.clientX, y: e.clientY });
    setStartDirection({ ...detailViewerState.mirror });
  };

  const onMouseUp = () => {
    setIsMouseDown(false);
  };

  const { origin, scale, mirror } = detailViewerState;

  const setOrigin = (newOrigin: { x: number; y: number }) => {
    setDetailViewerState((prev) => ({
      ...prev,
      origin: newOrigin,
    }));
  };
  const setScale = (newScale: number) => {
    setDetailViewerState((prev) => ({
      ...prev,
      scale: newScale,
    }));
  };
  const setMirror = (newMirror: { x: boolean; y: boolean }) => {
    setDetailViewerState((prev) => ({
      ...prev,
      mirror: newMirror,
    }));
  };

  const translateImage = (e: React.MouseEvent) => {
    const newOrigin = {
      x: origin.x + (e.movementX / scale) * (mirror.x ? -1 : 1),
      y: origin.y + (e.movementY / scale) * (mirror.y ? -1 : 1),
    };
    setOrigin(newOrigin);
  };

  const inverseImage = (e: React.MouseEvent) => {
    const rect = viewerRef.current.getBoundingClientRect();
    const startPointfromCenter = {
      x: startPoint.x - (rect.left + rect.width / 2),
      y: startPoint.y - (rect.top + rect.height / 2),
    };
    const currentPointfromCenter = {
      x: e.clientX - (rect.left + rect.width / 2),
      y: e.clientY - (rect.top + rect.height / 2),
    };
    const newMirror = { ...startDirection };
    if (startPointfromCenter.x * currentPointfromCenter.x < 0) {
      newMirror.x = !newMirror.x;
    }
    if (startPointfromCenter.y * currentPointfromCenter.y < 0) {
      newMirror.y = !newMirror.y;
    }
    setMirror(newMirror);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    if (!isRightButton) {
      translateImage(e);
    } else if (isRightButton) {
      inverseImage(e);
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    // const preScale = scale;
    let postScale: number;
    if (e.deltaY < 0) {
      postScale = Math.min(scale / 0.8, 8);
    } else {
      postScale = Math.max(scale * 0.8, 0.3);
    }
    setScale(postScale);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose(false);
    }
    if (e.key === '+') {
      const postScale = Math.min(scale / 0.8, 8);
      setScale(postScale);
    }
    if (e.key === '-') {
      const postScale = Math.max(scale * 0.8, 0.3);
      setScale(postScale);
    }
  };

  return (
    <div
      ref={viewerRef}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      onDragStart={(e) => e.preventDefault()}
      style={{
        flexGrow: '1',
        userSelect: 'none',
        overflow: 'hidden',
        cursor: isMouseDown ? 'grabbing' : 'grab',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <img
        ref={imgRef}
        src={path}
        alt="Detail"
        onDragStart={(e) => e.preventDefault()}
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${(mirror.x ? -1 : 1) * scale},${(mirror.y ? -1 : 1) * scale}) translate(${origin.x}px, ${origin.y}px)`,
          display: 'block',
          objectFit: 'contain',
          objectPosition: 'center center',
        }}
      />
    </div>
  );
}
