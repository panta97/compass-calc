export function decomposeLog(n: number): { mantissa: number; exponent: number } {
  if (!(n > 0) || !Number.isFinite(n)) {
    return { mantissa: NaN, exponent: 0 };
  }
  const exponent = Math.floor(Math.log10(n));
  const mantissa = n / Math.pow(10, exponent);
  return { mantissa, exponent };
}

export function formatScaleValue(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n >= 10) return n.toFixed(2);
  if (n >= 1) return n.toFixed(3);
  return n.toPrecision(3);
}

export function formatResult(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  if (abs >= 1e6 || abs < 1e-3) {
    return n.toExponential(4).replace(/e\+?/, ' × 10^').replace('^-', '^−');
  }
  const rounded = Number(n.toPrecision(5));
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 4 });
}
