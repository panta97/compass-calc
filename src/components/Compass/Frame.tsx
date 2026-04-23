import { polarToCartesian } from '../../lib/geometry';

interface FrameProps {
  bezelInner: number;
  bezelOuter: number;
}

export function Frame({ bezelInner, bezelOuter }: FrameProps) {
  const rivetRadius = (bezelInner + bezelOuter) / 2;
  const rivetCount = 16;
  const rivets = Array.from({ length: rivetCount }, (_, i) => {
    const angle = (i / rivetCount) * 360;
    return polarToCartesian(0, 0, rivetRadius, angle);
  });

  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* Outer brass bezel */}
      <circle cx={0} cy={0} r={bezelOuter} className="bezel-outer" />
      <circle cx={0} cy={0} r={bezelOuter - 2} className="bezel-outer-hi" />
      <circle cx={0} cy={0} r={bezelInner} className="bezel-inner-edge" />

      {/* Rivets */}
      {rivets.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={2.8} className="rivet" />
          <circle cx={p.x - 0.6} cy={p.y - 0.6} r={1.1} className="rivet-hi" />
        </g>
      ))}

      {/* Cardinal fleur-de-lis at top */}
      <g transform={`translate(0, ${-(bezelInner + bezelOuter) / 2})`}>
        <path
          d="M 0 -8 L 3 -3 L 6 -5 L 4 0 L 7 2 L 3 2 L 3 6 L 0 4 L -3 6 L -3 2 L -7 2 L -4 0 L -6 -5 L -3 -3 Z"
          className="fleur"
        />
      </g>
      {/* Small marks at E/S/W */}
      {[90, 180, 270].map((a) => {
        const p = polarToCartesian(0, 0, (bezelInner + bezelOuter) / 2, a);
        return (
          <g key={a} transform={`translate(${p.x} ${p.y}) rotate(${a})`}>
            <circle cx={0} cy={0} r={3.2} className="cardinal-mark" />
          </g>
        );
      })}
    </g>
  );
}
