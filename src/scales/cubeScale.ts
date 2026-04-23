import type { Scale, TickKind, TickSpec } from './types';

/**
 * K scale: cubed. Domain [1, 1000]. One full turn = 3 decades.
 * Position = log10(v) / 3.
 */
function buildTicks(): TickSpec[] {
  const valueToPosition = (v: number) => Math.log10(v) / 3;
  const out: TickSpec[] = [];
  const seen = new Set<number>();

  const classify = (u: number): TickKind => {
    const uTimes10 = Math.round(u * 10);
    if (uTimes10 % 10 === 0) return 'major';
    if (uTimes10 % 5 === 0) return 'mid';
    return 'minor';
  };

  const push = (v: number, base: number, label?: string) => {
    const k = Math.round(v * 10);
    if (seen.has(k)) return;
    seen.add(k);
    const u = v / base;
    out.push({ value: v, position: valueToPosition(v), kind: classify(u), label });
  };

  // Decade 0: 1 → 10, step 0.1
  for (let i = 0; i <= 90; i++) {
    const v = Math.round((1 + i * 0.1) * 10) / 10;
    push(v, 1);
  }
  // Decade 1: 10 → 100, step 1
  for (let i = 0; i <= 90; i++) push(10 + i, 10);
  // Decade 2: 100 → 1000, step 10
  for (let i = 0; i <= 90; i++) push(100 + i * 10, 100);

  for (const tick of out) {
    if (tick.kind !== 'major') continue;
    const v = tick.value;
    if (v >= 1 && v <= 9) tick.label = String(v);
    else if (v >= 10 && v <= 90 && v % 10 === 0) tick.label = String(v);
    else if (v >= 100 && v <= 1000 && v % 100 === 0) tick.label = String(v);
  }

  return out;
}

export const cubeScale: Scale = {
  id: 'K',
  label: 'K',
  domain: [1, 1000],
  valueToPosition: (v: number) => Math.log10(v) / 3,
  positionToValue: (p: number) => Math.pow(10, p * 3),
  ticks: buildTicks(),
};
