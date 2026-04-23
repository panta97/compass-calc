export type TickKind = 'major' | 'mid' | 'minor';

export interface TickSpec {
  value: number;
  /** Fractional position around the circle, in [0, 1). */
  position: number;
  kind: TickKind;
  label?: string;
}

/**
 * A scale maps domain values to fractional positions around a circle.
 * Multiple scale types can coexist (log for × ÷, squared for A/B, trig for S/T, etc.).
 * v1 only ships a log scale; the interface is here so more can be added without rework.
 */
export interface Scale {
  id: string;
  label: string;
  domain: [number, number];
  valueToPosition(value: number): number;
  positionToValue(position: number): number;
  ticks: TickSpec[];
}
