import { logScale } from './logScale';
import { squareScale } from './squareScale';
import { cubeScale } from './cubeScale';
import { sineScale } from './sineScale';
import { tangentScale } from './tangentScale';
import type { Scale } from './types';

export const scaleRegistry: Record<string, Scale> = {
  log: logScale,
  square: squareScale,
  cube: cubeScale,
  sine: sineScale,
  tangent: tangentScale,
};

export { logScale, squareScale, cubeScale, sineScale, tangentScale };
export type { Scale, TickSpec, TickKind } from './types';
