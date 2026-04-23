import { useCallback, useState } from 'react';
import { Compass } from './components/Compass/Compass';
import { Controls } from './components/Controls/Controls';
import { MODES_BY_ID } from './modes';
import './App.css';

export default function App() {
  const [modeId, setModeId] = useState('times');
  const [innerRotation, setInnerRotation] = useState(0);
  const [cursorRotation, setCursorRotation] = useState(0);

  const mode = MODES_BY_ID[modeId];

  const onModeChange = useCallback((id: string) => {
    const next = MODES_BY_ID[id];
    if (!next) return;
    setModeId(id);
    // Unary modes keep the inner ring anchored at 0.
    if (!next.innerRotatable) setInnerRotation(0);
  }, []);

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
          outerScale={mode.outerScale}
          innerScale={mode.innerScale}
          innerRotation={innerRotation}
          cursorRotation={cursorRotation}
          operationLabel={mode.glyph}
          innerRotatable={mode.innerRotatable}
          onInnerRotationChange={setInnerRotation}
          onCursorRotationChange={setCursorRotation}
        />
        <Controls mode={mode} onModeChange={onModeChange} />
      </main>
    </div>
  );
}
