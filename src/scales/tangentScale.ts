import type { Scale, TickSpec } from './types';

/**
 * T scale: tangent. Angle in degrees. Domain [5.71°, 45°] (tan 0.1 → 1).
 * Position = log10(10 · tan(θ)).
 */
const DEG = Math.PI / 180;
const tanDeg = (d: number) => Math.tan(d * DEG);

const valueToPosition = (deg: number) => Math.log10(10 * tanDeg(deg));
const positionToValue = (p: number) => {
  const t = Math.pow(10, p) / 10;
  return Math.atan(t) / DEG;
};

const MAJOR_ANGLES = [6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45];
const MID_ANGLES = [11, 12, 13, 14, 16, 17, 18, 19, 22, 28, 32, 38, 42];

function buildTicks(): TickSpec[] {
  const out: TickSpec[] = [];
  for (let d = 6; d <= 45; d++) {
    const kind = MAJOR_ANGLES.includes(d)
      ? 'major'
      : MID_ANGLES.includes(d)
        ? 'mid'
        : 'minor';
    out.push({
      value: d,
      position: valueToPosition(d),
      kind,
      label: kind === 'major' ? String(d) : undefined,
    });
  }
  return out;
}

export const tangentScale: Scale = {
  id: 'T',
  label: 'T',
  domain: [5.71, 45],
  valueToPosition,
  positionToValue,
  ticks: buildTicks(),
};
