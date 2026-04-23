import type { PointerEvent as ReactPointerEvent } from 'react';

interface CursorProps {
  angleDeg: number;
  innerRadius: number;
  outerRadius: number;
  onPointerDown?: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerMove?: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerCancel?: (e: ReactPointerEvent<SVGElement>) => void;
}

export function Cursor({
  angleDeg,
  innerRadius,
  outerRadius,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: CursorProps) {
  // Local space: angle 0 points up (−y). Group will rotate.
  return (
    <g transform={`rotate(${angleDeg})`} style={{ touchAction: 'none' }}>
      {/* Invisible wide grab zone for touch usability */}
      <rect
        x={-14}
        y={-outerRadius}
        width={28}
        height={outerRadius - innerRadius}
        fill="transparent"
        style={{ cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      />
      {/* Brass knob at the top */}
      <g style={{ pointerEvents: 'none' }}>
        <circle cx={0} cy={-outerRadius + 2} r={9} className="cursor-knob" />
        <circle cx={0} cy={-outerRadius + 2} r={4} className="cursor-knob-inner" />
      </g>
      {/* Hairline */}
      <line
        x1={0}
        y1={-outerRadius + 8}
        x2={0}
        y2={-innerRadius}
        className="cursor-hairline"
        style={{ pointerEvents: 'none' }}
      />
      {/* Glow layer behind hairline for candlelight feel */}
      <line
        x1={0}
        y1={-outerRadius + 8}
        x2={0}
        y2={-innerRadius}
        className="cursor-hairline-glow"
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
}
