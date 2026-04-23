import { logScale } from './logScale';
import type { Scale } from './types';

export const scaleRegistry: Record<string, Scale> = {
  log: logScale,
};

export { logScale };
export type { Scale, TickSpec, TickKind } from './types';
