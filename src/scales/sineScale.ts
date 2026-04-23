import type { Scale, TickSpec } from './types';

/**
 * S scale: sine. Input is an angle in degrees.
 * Position = log10(10 · sin(θ)) — maps θ ≈ 5.739° (sin = 0.1) to 0,
 * and θ = 90° (sin = 1) to 1.
 */
const DEG = Math.PI / 180;
const sinDeg = (d: number) => Math.sin(d * DEG);

const valueToPosition = (deg: number) => Math.log10(10 * sinDeg(deg));
const positionToValue = (p: number) => {
  const s = Math.pow(10, p) / 10; // clamp for safety
  return Math.asin(Math.min(1, Math.max(0, s))) / DEG;
};

const MAJOR_ANGLES = [6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90];
const MID_ANGLES = [11, 12, 13, 14, 16, 17, 18, 19, 22, 28, 32, 38, 42, 48, 55, 65, 75, 85];

function buildTicks(): TickSpec[] {
  const out: TickSpec[] = [];
  for (let d = 6; d <= 90; d++) {
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

export const sineScale: Scale = {
  id: 'S',
  label: 'S',
  domain: [5.74, 90],
  valueToPosition,
  positionToValue,
  ticks: buildTicks(),
};
