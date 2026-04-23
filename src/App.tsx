import { useCallback, useState } from 'react';
import { Compass } from './components/Compass/Compass';
import { logScale } from './scales';
import './App.css';

export default function App() {
  const [innerRotation, setInnerRotation] = useState(0);
  const [cursorRotation, setCursorRotation] = useState(0);

  const onInnerRotationChange = useCallback(
    (deg: number) => setInnerRotation(deg),
    [],
  );
  const onCursorRotationChange = useCallback(
    (deg: number) => setCursorRotation(deg),
    [],
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
          onInnerRotationChange={onInnerRotationChange}
          onCursorRotationChange={onCursorRotationChange}
        />
      </main>
    </div>
  );
}
