import { useCallback, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { cartesianToAngle, normalizeAngle, shortestAngleDelta } from './geometry';

export interface PolarDragHandlers {
  onPointerDown: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerMove: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerUp: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerCancel: (e: ReactPointerEvent<SVGElement>) => void;
}

function eventToSvgCoords(svg: SVGSVGElement, e: ReactPointerEvent) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}

/**
 * Rotates a value tracked by the caller based on the user dragging around the
 * SVG's center. The SVG's viewBox must be centered at (0, 0).
 */
export function usePolarDrag(
  svgRef: RefObject<SVGSVGElement | null>,
  getAngle: () => number,
  onChange: (nextAngle: number) => void,
  onStart?: () => void,
): PolarDragHandlers & { dragging: boolean } {
  const [dragging, setDragging] = useState(false);
  const lastPointerAngleRef = useRef(0);
  const activePointerIdRef = useRef<number | null>(null);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<SVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const { x, y } = eventToSvgCoords(svg, e);
      lastPointerAngleRef.current = cartesianToAngle(0, 0, x, y);
      activePointerIdRef.current = e.pointerId;
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      setDragging(true);
      onStart?.();
    },
    [svgRef, onStart],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<SVGElement>) => {
      if (activePointerIdRef.current !== e.pointerId) return;
      const svg = svgRef.current;
      if (!svg) return;
      const { x, y } = eventToSvgCoords(svg, e);
      const currentPointerAngle = cartesianToAngle(0, 0, x, y);
      const delta = shortestAngleDelta(lastPointerAngleRef.current, currentPointerAngle);
      lastPointerAngleRef.current = currentPointerAngle;
      onChange(normalizeAngle(getAngle() + delta));
    },
    [svgRef, getAngle, onChange],
  );

  const release = useCallback((e: ReactPointerEvent<SVGElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }
    setDragging(false);
  }, []);

  return {
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: release,
    onPointerCancel: release,
  };
}
