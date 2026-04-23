import type { Mode } from '../../modes';
import { MODES } from '../../modes';
import './controls.css';

interface ControlsProps {
  mode: Mode;
  onModeChange: (id: string) => void;
}

export function Controls({ mode, onModeChange }: ControlsProps) {
  return (
    <div className="mode-chips" role="radiogroup" aria-label="Operation">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          role="radio"
          aria-checked={mode.id === m.id}
          className={`mode-chip ${mode.id === m.id ? 'is-active' : ''}`}
          onClick={() => onModeChange(m.id)}
          title={m.label}
        >
          {m.glyph}
        </button>
      ))}
    </div>
  );
}
