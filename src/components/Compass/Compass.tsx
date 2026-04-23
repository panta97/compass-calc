import { useCallback, useRef } from 'react';
import type { Scale } from '../../scales';
import { usePolarDrag } from '../../lib/usePolarDrag';
import { Ring } from './Ring';
import { Cursor } from './Cursor';
import { Frame } from './Frame';
import { Medallion } from './Medallion';
import './compass.css';

interface CompassProps {
  outerScale: Scale;
  innerScale: Scale;
  innerRotation: number;
  cursorRotation: number;
  operationLabel?: string;
  onInnerRotationChange: (deg: number) => void;
  onCursorRotationChange: (deg: number) => void;
}

// Geometry constants (SVG user units). The SVG viewBox is centered at (0, 0).
const VIEW = 260;
const BEZEL_OUTER = 250;
const BEZEL_INNER = 222;
const OUTER_FACE_OUTER = 222;
const OUTER_FACE_INNER = 178;
const READING_BOUNDARY = 178;
const INNER_FACE_OUTER = 178;
const INNER_FACE_INNER = 128;
const MEDALLION_R = 124;
const CURSOR_OUTER = 226;
const CURSOR_INNER = 126;

export function Compass({
  outerScale,
  innerScale,
  innerRotation,
  cursorRotation,
  operationLabel = '',
  onInnerRotationChange,
  onCursorRotationChange,
}: CompassProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const getInner = useCallback(() => innerRotation, [innerRotation]);
  const getCursor = useCallback(() => cursorRotation, [cursorRotation]);

  const innerDrag = usePolarDrag(svgRef, getInner, onInnerRotationChange);
  const cursorDrag = usePolarDrag(svgRef, getCursor, onCursorRotationChange);

  return (
    <div className="compass-wrapper">
      <svg
        ref={svgRef}
        viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
        className="compass-svg"
        role="img"
        aria-label="Circular logarithmic slide rule"
      >
        <defs>
          <radialGradient id="brass-grad" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#f5d486" />
            <stop offset="45%" stopColor="#c59544" />
            <stop offset="80%" stopColor="#7a4e1c" />
            <stop offset="100%" stopColor="#3a2410" />
          </radialGradient>
          <radialGradient id="brass-rim" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffe9b0" />
            <stop offset="50%" stopColor="#b87d36" />
            <stop offset="100%" stopColor="#2d1a08" />
          </radialGradient>
          <radialGradient id="parchment-outer" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ecd6a8" />
            <stop offset="80%" stopColor="#c9a66a" />
            <stop offset="100%" stopColor="#876330" />
          </radialGradient>
          <radialGradient id="parchment-inner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8d3a5" />
            <stop offset="80%" stopColor="#c19e60" />
            <stop offset="100%" stopColor="#7a5a2b" />
          </radialGradient>
          <radialGradient id="medallion-grad" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#eac47a" />
            <stop offset="70%" stopColor="#a06d2c" />
            <stop offset="100%" stopColor="#3a2410" />
          </radialGradient>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="candle-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Drop shadow ring behind the whole compass */}
        <circle cx={0} cy={0} r={BEZEL_OUTER + 4} className="compass-shadow" />

        {/* Outer bezel base */}
        <circle cx={0} cy={0} r={BEZEL_OUTER} fill="url(#brass-grad)" />
        <circle cx={0} cy={0} r={BEZEL_INNER + 2} className="bezel-inner-well" />

        {/* Frame decorative details (rivets, fleur, cardinals) */}
        <Frame bezelInner={BEZEL_INNER} bezelOuter={BEZEL_OUTER} />

        {/* Outer (fixed) D scale — parchment and engraved ticks */}
        <Ring
          scale={outerScale}
          rotationDeg={0}
          rootRadius={READING_BOUNDARY}
          tickLen={{ major: 20, mid: 13, minor: 8 }}
          direction={1}
          labelRadius={OUTER_FACE_OUTER - 12}
          labelSize={16}
          faceInner={OUTER_FACE_INNER}
          faceOuter={OUTER_FACE_OUTER}
          faceClassName="face-parchment-outer"
          tickClassName="tick-mark"
          labelClassName="tick-label"
        />

        {/* Inner (rotating) C scale */}
        <Ring
          scale={innerScale}
          rotationDeg={innerRotation}
          rootRadius={READING_BOUNDARY}
          tickLen={{ major: 20, mid: 13, minor: 8 }}
          direction={-1}
          labelRadius={INNER_FACE_INNER + 12}
          labelSize={16}
          faceInner={INNER_FACE_INNER}
          faceOuter={INNER_FACE_OUTER}
          faceClassName="face-parchment-inner"
          tickClassName="tick-mark"
          labelClassName="tick-label"
          interactive
          onPointerDown={innerDrag.onPointerDown}
          onPointerMove={innerDrag.onPointerMove}
          onPointerUp={innerDrag.onPointerUp}
          onPointerCancel={innerDrag.onPointerCancel}
        />

        {/* Reading boundary line */}
        <circle
          cx={0}
          cy={0}
          r={READING_BOUNDARY}
          className="reading-boundary"
          style={{ pointerEvents: 'none' }}
        />

        {/* Center medallion */}
        <Medallion radius={MEDALLION_R} operationLabel={operationLabel} />

        {/* Cursor hairline on top */}
        <Cursor
          angleDeg={cursorRotation}
          innerRadius={CURSOR_INNER}
          outerRadius={CURSOR_OUTER}
          onPointerDown={cursorDrag.onPointerDown}
          onPointerMove={cursorDrag.onPointerMove}
          onPointerUp={cursorDrag.onPointerUp}
          onPointerCancel={cursorDrag.onPointerCancel}
        />
      </svg>
    </div>
  );
}
