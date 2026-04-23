import { useCallback, useState } from 'react';
import { Compass } from './components/Compass/Compass';
import { Controls } from './components/Controls/Controls';
import { logScale } from './scales';
import { shortestAngleDelta } from './lib/geometry';
import { formatScaleValue } from './lib/number';
import {
  OPERATION_SYMBOL,
  computeCursorAngle,
  computeInnerAngle,
  rotateMantissa,
} from './lib/slideRule';
import type { Operation } from './lib/slideRule';
import './App.css';

function parsePositive(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export default function App() {
  const [operation, setOperation] = useState<Operation>('multiply');
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [aInput, setAInputRaw] = useState('2');
  const [bInput, setBInputRaw] = useState('3');

  const innerRotation = computeInnerAngle(a, b, operation);
  const cursorRotation = computeCursorAngle(a, b, operation);

  const onAInputChange = useCallback((raw: string) => {
    setAInputRaw(raw);
    const parsed = parsePositive(raw);
    if (parsed !== null) setA(parsed);
  }, []);

  const onBInputChange = useCallback((raw: string) => {
    setBInputRaw(raw);
    const parsed = parsePositive(raw);
    if (parsed !== null) setB(parsed);
  }, []);

  const onReset = useCallback(() => {
    setA(2);
    setB(3);
    setAInputRaw('2');
    setBInputRaw('3');
  }, []);

  const handleInnerRotation = useCallback(
    (newAngle: number) => {
      const delta = shortestAngleDelta(innerRotation, newAngle);
      const deltaLog = delta / 360;
      if (operation === 'multiply') {
        const next = rotateMantissa(a, deltaLog);
        setA(next);
        setAInputRaw(formatScaleValue(next));
      } else {
        // divide: inner = log(a/b); a fixed → b rotates opposite
        const next = rotateMantissa(b, -deltaLog);
        setB(next);
        setBInputRaw(formatScaleValue(next));
      }
    },
    [a, b, operation, innerRotation],
  );

  const handleCursorRotation = useCallback(
    (newAngle: number) => {
      const delta = shortestAngleDelta(cursorRotation, newAngle);
      const deltaLog = delta / 360;
      if (operation === 'multiply') {
        const next = rotateMantissa(b, deltaLog);
        setB(next);
        setBInputRaw(formatScaleValue(next));
      } else {
        const next = rotateMantissa(a, deltaLog);
        setA(next);
        setAInputRaw(formatScaleValue(next));
      }
    },
    [a, b, operation, cursorRotation],
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Compass&nbsp;Calc</h1>
        <p className="app-subtitle">
          A circular slide rule for the lost and the learning
        </p>
      </header>

      <main className="app-main">
        <Compass
          outerScale={logScale}
          innerScale={logScale}
          innerRotation={innerRotation}
          cursorRotation={cursorRotation}
          operationLabel={OPERATION_SYMBOL[operation]}
          onInnerRotationChange={handleInnerRotation}
          onCursorRotationChange={handleCursorRotation}
        />
        <Controls
          operation={operation}
          a={a}
          b={b}
          aInput={aInput}
          bInput={bInput}
          onOperationChange={setOperation}
          onAInputChange={onAInputChange}
          onBInputChange={onBInputChange}
          onReset={onReset}
        />
      </main>
    </div>
  );
}
