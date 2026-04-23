import type { Scale, TickKind, TickSpec } from './types';

/**
 * A scale: squared. Domain [1, 100]. One full turn = 2 decades.
 * Position = log10(v) / 2.
 * Used for x² and √x when paired with a D scale.
 */
function buildTicks(): TickSpec[] {
  const valueToPosition = (v: number) => Math.log10(v) / 2;
  const out: TickSpec[] = [];
  const seen = new Set<number>();

  const classify = (v: number, decade: 0 | 1): TickKind => {
    const base = decade === 0 ? 1 : 10;
    const u = v / base; // u in [1, 10]
    const uTimes10 = Math.round(u * 10);
    if (uTimes10 % 10 === 0) return 'major';
    if (uTimes10 % 5 === 0) return 'mid';
    return 'minor';
  };

  const push = (v: number, decade: 0 | 1, label?: string) => {
    const k = Math.round(v * 100);
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ value: v, position: valueToPosition(v), kind: classify(v, decade), label });
  };

  // Decade 0: 1 → 10 (tenth steps, ticks cover full half-circle)
  for (let i = 0; i <= 90; i++) {
    const v = Math.round((1 + i * 0.1) * 100) / 100;
    push(v, 0);
  }
  // Decade 1: 10 → 100 (step 1)
  for (let i = 0; i <= 90; i++) {
    const v = 10 + i;
    push(v, 1);
  }

  for (const tick of out) {
    if (tick.kind !== 'major') continue;
    if (tick.value >= 1 && tick.value <= 9) tick.label = String(tick.value);
    else if (tick.value >= 10 && tick.value <= 100 && tick.value % 10 === 0) {
      tick.label = String(tick.value);
    }
  }

  return out;
}

export const squareScale: Scale = {
  id: 'A',
  label: 'A',
  domain: [1, 100],
  valueToPosition: (v: number) => Math.log10(v) / 2,
  positionToValue: (p: number) => Math.pow(10, p * 2),
  ticks: buildTicks(),
};
