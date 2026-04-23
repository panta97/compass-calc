import type { PointerEvent as ReactPointerEvent } from 'react';
import type { Scale, TickSpec } from '../../scales';
import { polarToCartesian } from '../../lib/geometry';

interface RingProps {
  scale: Scale;
  rotationDeg: number;
  /** Where tick roots sit (the shared boundary between two rings). */
  rootRadius: number;
  /** Tick lengths by kind. Ticks extend from rootRadius along this direction. */
  tickLen: { major: number; mid: number; minor: number };
  /** +1 = ticks grow outward from center; -1 = ticks grow inward. */
  direction: 1 | -1;
  /** Radius at which number labels are centered. */
  labelRadius: number;
  labelSize: number;
  /** Annulus background path (optional) — filled with parchment. */
  faceInner: number;
  faceOuter: number;
  faceClassName?: string;
  tickClassName?: string;
  labelClassName?: string;
  onPointerDown?: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerMove?: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<SVGElement>) => void;
  onPointerCancel?: (e: ReactPointerEvent<SVGElement>) => void;
  interactive?: boolean;
}

function annulusPath(inner: number, outer: number): string {
  // Two circles via arcs; even-odd fill yields a ring.
  return [
    `M ${outer} 0`,
    `A ${outer} ${outer} 0 1 1 ${-outer} 0`,
    `A ${outer} ${outer} 0 1 1 ${outer} 0 Z`,
    `M ${inner} 0`,
    `A ${inner} ${inner} 0 1 0 ${-inner} 0`,
    `A ${inner} ${inner} 0 1 0 ${inner} 0 Z`,
  ].join(' ');
}

function Tick({
  tick,
  rootRadius,
  direction,
  tickLen,
  className,
}: {
  tick: TickSpec;
  rootRadius: number;
  direction: 1 | -1;
  tickLen: { major: number; mid: number; minor: number };
  className?: string;
}) {
  const angle = tick.position * 360;
  const len = tickLen[tick.kind];
  const r0 = rootRadius;
  const r1 = rootRadius + direction * len;
  const p0 = polarToCartesian(0, 0, r0, angle);
  const p1 = polarToCartesian(0, 0, r1, angle);
  const widths = { major: 1.4, mid: 0.9, minor: 0.55 };
  return (
    <line
      x1={p0.x}
      y1={p0.y}
      x2={p1.x}
      y2={p1.y}
      strokeWidth={widths[tick.kind]}
      strokeLinecap="round"
      className={className}
    />
  );
}

export function Ring({
  scale,
  rotationDeg,
  rootRadius,
  tickLen,
  direction,
  labelRadius,
  labelSize,
  faceInner,
  faceOuter,
  faceClassName,
  tickClassName,
  labelClassName,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  interactive = false,
}: RingProps) {
  return (
    <g
      transform={`rotate(${rotationDeg})`}
      style={{ touchAction: interactive ? 'none' : undefined, cursor: interactive ? 'grab' : undefined }}
    >
      <path
        d={annulusPath(faceInner, faceOuter)}
        fillRule="evenodd"
        className={faceClassName}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      />
      <g style={{ pointerEvents: 'none' }}>
        {scale.ticks.map((tick, i) => (
          <Tick
            key={`${scale.id}-${i}`}
            tick={tick}
            rootRadius={rootRadius}
            direction={direction}
            tickLen={tickLen}
            className={tickClassName}
          />
        ))}
        {scale.ticks
          .filter((t) => t.label)
          .map((tick, i) => {
            const angle = tick.position * 360;
            const isMajor = tick.kind === 'major';
            // Mid labels sit slightly deeper than integer labels
            const r = isMajor ? labelRadius : labelRadius - direction * 4;
            const size = isMajor ? labelSize : labelSize * 0.62;
            const { x, y } = polarToCartesian(0, 0, r, angle);
            const cls = isMajor
              ? labelClassName
              : `${labelClassName ?? ''} tick-label-sub`.trim();
            return (
              <text
                key={`${scale.id}-lbl-${i}`}
                x={x}
                y={y}
                fontSize={size}
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${angle} ${x} ${y})`}
                className={cls}
              >
                {tick.label}
              </text>
            );
          })}
      </g>
    </g>
  );
}
