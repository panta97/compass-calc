export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

export function cartesianToAngle(
  cx: number,
  cy: number,
  x: number,
  y: number,
): number {
  const rad = Math.atan2(y - cy, x - cx);
  const deg = (rad * 180) / Math.PI + 90;
  return normalizeAngle(deg);
}

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function shortestAngleDelta(from: number, to: number): number {
  const d = normalizeAngle(to - from);
  return d > 180 ? d - 360 : d;
}
