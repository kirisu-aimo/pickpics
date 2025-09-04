import React, { useRef, useEffect } from 'react';

interface Props {
  index: number;
  children: React.ReactElement;
  colWidth: number;
  position: { left: number; top: number } | null;
  onMount: (index: number, height: number) => void;
}

export default function MasonryItem({
  index,
  children,
  colWidth,
  position,
  onMount,
}: Props) {
  const masonryItemRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (masonryItemRef.current) {
      const { height } = masonryItemRef.current.getBoundingClientRect();
      onMount(index, height);
    }
    // eslint-disable-next-line
  }, [colWidth, children, index, position]);

  return (
    <div
      key={children.key}
      ref={masonryItemRef}
      style={{
        position: position ? 'absolute' : 'static',
        width: colWidth,
        left: position?.left ?? 0,
        top: position?.top ?? 0,
      }}
    >
      {children}
    </div>
  );
}
