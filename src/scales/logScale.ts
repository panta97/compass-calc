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
    const hundredths = Math.round(v * 100);
    if (hundredths % 100 === 0) return 'major';   // integer
    if (hundredths % 10 === 0) return 'mid';      // exact tenth
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

  // Labels: integer majors (1..9) get a full numeral.
  // Mid ticks get a trailing-digit label in the regions where there's
  // room — tenths between 1 and 2, halves between 2 and 5.
  for (const tick of out) {
    const v = tick.value;
    if (tick.kind === 'major' && v >= 1 && v <= 9) {
      tick.label = String(Math.round(v));
      continue;
    }
    if (tick.kind === 'mid') {
      if (v > 1 && v < 2) {
        // 1.1 → "1", 1.2 → "2", ..., 1.9 → "9"
        tick.label = String(Math.round((v - 1) * 10));
      } else if (v > 2 && v < 5 && Math.abs(v - Math.round(v) - 0.5) < 1e-6) {
        // 2.5, 3.5, 4.5 → "5"
        tick.label = '5';
      }
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
