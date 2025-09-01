import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MasonryItem from './MasonryItem';

interface Props {
  children: React.ReactElement[];
  optimalWidth: number;
  gap: number;
}

export default function MasonryContainer({
  children,
  optimalWidth = 150,
  gap = 10,
}: Props) {
  const masonryContainerRef = useRef<HTMLDivElement>(null!);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [columns, setColumns] = useState(1);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const [positions, setPositions] = useState<{ left: number; top: number }[]>(
    [],
  );
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const element = masonryContainerRef.current;
    const observer = new ResizeObserver(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setContainerWidth(element.offsetWidth);
      }, 100);
    });
    if (element) {
      observer.observe(element);
    }
    return () => {
      if (element) {
        observer.unobserve(element);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (containerWidth > 0) {
      const optimalColumns = (containerWidth - gap) / (optimalWidth + gap);
      const intColumns = Math.floor(
        (Math.sqrt(4 * optimalColumns ** 2 + 1) + 1) / 2,
      );
      setColumns(Math.max(1, intColumns));
    }
  }, [containerWidth, optimalWidth, gap]);

  const handleItemMount = (index: number, height: number) => {
    if (itemHeights[index] === height) return;
    setItemHeights((prev) => {
      const next = [...prev];
      next[index] = height;
      return next;
    });
  };

  useEffect(() => {
    if (itemHeights.length === children.length) {
      const colHeights = Array(columns).fill(0);
      const colWidth = Math.floor((containerWidth - gap) / columns - gap);
      const pos: { left: number; top: number }[] = [];
      let maxHeights = 0;
      children.forEach((_, i) => {
        const minColHeightsIdx = colHeights.reduce(
          (prevIdx, current, currIdx, array) =>
            array[prevIdx] <= current ? prevIdx : currIdx,
          0,
        );
        const left = (colWidth + gap) * minColHeightsIdx + gap;
        const top = colHeights[minColHeightsIdx] + gap;
        pos[i] = { left, top };
        colHeights[minColHeightsIdx] = top + itemHeights[i];
        maxHeights = Math.max(maxHeights, top + itemHeights[i]);
      });
      setPositions(pos);
      setContainerHeight(maxHeights + gap);
    }
  }, [itemHeights, columns, containerWidth, gap, children]);

  return (
    <div
      ref={masonryContainerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: containerHeight,
        minHeight: '100vh',
        // overflowY: 'scroll',
      }}
    >
      {children.map((child, idx) => {
        return (
          <MasonryItem
            index={idx}
            key={uuidv4()}
            onMount={handleItemMount}
            colWidth={Math.floor((containerWidth - gap) / columns - gap)}
            position={positions[idx] || null}
          >
            {child}
          </MasonryItem>
        );
      })}
    </div>
  );
}
