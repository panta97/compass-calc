export type Operation = 'multiply' | 'divide';

export const OPERATION_SYMBOL: Record<Operation, string> = {
  multiply: '×',
  divide: '÷',
};

function fracLog(value: number): number {
  if (!(value > 0) || !Number.isFinite(value)) return 0;
  const l = Math.log10(value);
  const f = l - Math.floor(l);
  return f;
}

/** Angle (deg, 0..360) where the inner ring's "1" points on the outer scale. */
export function computeInnerAngle(a: number, b: number, op: Operation): number {
  switch (op) {
    case 'multiply':
      return fracLog(a) * 360;
    case 'divide':
      return fracLog(safeDiv(a, b)) * 360;
  }
}

/** Angle (deg, 0..360) where the cursor hairline points on the outer scale. */
export function computeCursorAngle(a: number, b: number, op: Operation): number {
  switch (op) {
    case 'multiply':
      return fracLog(a * b) * 360;
    case 'divide':
      return fracLog(a) * 360;
  }
}

export function computeResult(a: number, b: number, op: Operation): number {
  return op === 'multiply' ? a * b : safeDiv(a, b);
}

function safeDiv(a: number, b: number): number {
  if (b === 0) return Infinity;
  return a / b;
}

/**
 * Rotate a value by `deltaLog` turns of the log scale (one turn = factor of 10).
 * Preserves the exponent (mantissa wraps within [1, 10)).
 */
export function rotateMantissa(value: number, deltaLog: number): number {
  if (!(value > 0) || !Number.isFinite(value)) return value;
  const l = Math.log10(value);
  const exp = Math.floor(l);
  const frac = l - exp;
  let newFrac = (frac + deltaLog) % 1;
  if (newFrac < 0) newFrac += 1;
  return Math.pow(10, exp + newFrac);
}
