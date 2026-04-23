import { polarToCartesian } from '../../lib/geometry';

interface MedallionProps {
  radius: number;
  operationLabel: string;
}

export function Medallion({ radius, operationLabel }: MedallionProps) {
  // 8-point compass rose
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360;
    const r = i % 2 === 0 ? radius * 0.7 : radius * 0.25;
    return polarToCartesian(0, 0, r, angle);
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <g style={{ pointerEvents: 'none' }}>
      <circle cx={0} cy={0} r={radius} className="medallion-bg" />
      <circle cx={0} cy={0} r={radius * 0.92} className="medallion-bg-inner" />
      <path d={path} className="compass-rose" />
      {/* Cardinal spikes — long N/S, shorter E/W */}
      {[0, 90, 180, 270].map((a) => {
        const tip = polarToCartesian(0, 0, radius * 0.82, a);
        const base1 = polarToCartesian(0, 0, radius * 0.12, a - 8);
        const base2 = polarToCartesian(0, 0, radius * 0.12, a + 8);
        const isVertical = a === 0 || a === 180;
        return (
          <path
            key={a}
            d={`M ${tip.x} ${tip.y} L ${base1.x} ${base1.y} L ${base2.x} ${base2.y} Z`}
            className={isVertical ? 'rose-spike-major' : 'rose-spike-minor'}
          />
        );
      })}
      <circle cx={0} cy={0} r={radius * 0.14} className="medallion-hub" />
      <circle cx={0} cy={0} r={radius * 0.07} className="medallion-hub-inner" />
      {/* Operation label engraved below center */}
      <text
        x={0}
        y={radius * 0.55}
        textAnchor="middle"
        className="medallion-label"
        fontSize={radius * 0.12}
      >
        {operationLabel}
      </text>
    </g>
  );
}
