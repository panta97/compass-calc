import { logScale, squareScale, cubeScale, sineScale, tangentScale } from './scales';
import type { Scale } from './scales';

export interface Mode {
  id: string;
  label: string;
  glyph: string;
  outerScale: Scale;
  innerScale: Scale;
  /** True if the inner ring can be rotated by the user (binary ops like × ÷). */
  innerRotatable: boolean;
}

export const MODES: Mode[] = [
  {
    id: 'times',
    label: 'Multiply / Divide',
    glyph: '×',
    outerScale: logScale,
    innerScale: logScale,
    innerRotatable: true,
  },
  {
    id: 'square',
    label: 'Square / Square root',
    glyph: 'x²',
    outerScale: squareScale,
    innerScale: logScale,
    innerRotatable: true,
  },
  {
    id: 'cube',
    label: 'Cube / Cube root',
    glyph: 'x³',
    outerScale: cubeScale,
    innerScale: logScale,
    innerRotatable: true,
  },
  {
    id: 'sin',
    label: 'Sine / Cosine',
    glyph: 'sin',
    outerScale: logScale,
    innerScale: sineScale,
    innerRotatable: true,
  },
  {
    id: 'tan',
    label: 'Tangent',
    glyph: 'tan',
    outerScale: logScale,
    innerScale: tangentScale,
    innerRotatable: true,
  },
];

export const MODES_BY_ID: Record<string, Mode> = Object.fromEntries(
  MODES.map((m) => [m.id, m]),
);
