import type { Scale, TickKind, TickSpec } from './types';

function buildLogTicks(): TickSpec[] {
  const valueToPosition = (v: number) => Math.log10(v);
  const out: TickSpec[] = [];
  const seen = new Set<number>();

  const push = (value: number, kind: TickKind, label?: string) => {
    const key = Math.round(value * 1000);
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ value, position: valueToPosition(value), kind, label });
  };

  const classify = (v: number): TickKind => {
    const rounded = Math.round(v * 1000) / 1000;
    if (Number.isInteger(rounded)) return 'major';
    if (Number.isInteger(Math.round(rounded * 10) / 10)) return 'mid';
    return 'minor';
  };

  // Dense region 1.0 → 2.0, step 0.02
  for (let i = 0; i <= 50; i++) {
    const v = 1 + i * 0.02;
    const r = Math.round(v * 1000) / 1000;
    push(r, classify(r));
  }
  // Medium 2.0 → 5.0, step 0.05
  for (let i = 0; i <= 60; i++) {
    const v = 2 + i * 0.05;
    const r = Math.round(v * 1000) / 1000;
    push(r, classify(r));
  }
  // Loose 5.0 → 10.0, step 0.1
  for (let i = 0; i <= 50; i++) {
    const v = 5 + i * 0.1;
    const r = Math.round(v * 1000) / 1000;
    push(r, classify(r));
  }

  // Labels for major integer ticks 1..9 (10 coincides with 1 around the circle)
  for (const tick of out) {
    if (tick.kind === 'major' && tick.value >= 1 && tick.value <= 9) {
      tick.label = String(Math.round(tick.value));
    }
  }

  return out;
}

export const logScale: Scale = {
  id: 'log',
  label: 'C · D',
  domain: [1, 10],
  valueToPosition: (v: number) => Math.log10(v),
  positionToValue: (p: number) => Math.pow(10, p),
  ticks: buildLogTicks(),
};
