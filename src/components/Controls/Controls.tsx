import { useId } from 'react';
import { formatResult } from '../../lib/number';
import type { Operation } from '../../lib/slideRule';
import { OPERATION_SYMBOL, computeResult } from '../../lib/slideRule';
import './controls.css';

interface ControlsProps {
  operation: Operation;
  a: number;
  b: number;
  aInput: string;
  bInput: string;
  onOperationChange: (op: Operation) => void;
  onAInputChange: (raw: string) => void;
  onBInputChange: (raw: string) => void;
  onReset: () => void;
}

const OPERATIONS: { value: Operation; glyph: string; label: string }[] = [
  { value: 'multiply', glyph: '×', label: 'Multiply' },
  { value: 'divide', glyph: '÷', label: 'Divide' },
];

export function Controls({
  operation,
  a,
  b,
  aInput,
  bInput,
  onOperationChange,
  onAInputChange,
  onBInputChange,
  onReset,
}: ControlsProps) {
  const aId = useId();
  const bId = useId();
  const result = computeResult(a, b, operation);

  return (
    <aside className="controls">
      <fieldset className="op-picker" aria-label="Operation">
        <legend>Operation</legend>
        <div className="op-picker-buttons" role="radiogroup">
          {OPERATIONS.map((op) => (
            <button
              key={op.value}
              type="button"
              role="radio"
              aria-checked={operation === op.value}
              className={`op-btn ${operation === op.value ? 'is-active' : ''}`}
              onClick={() => onOperationChange(op.value)}
              title={op.label}
            >
              <span className="op-glyph">{op.glyph}</span>
              <span className="op-label">{op.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="inputs">
        <div className="input-row">
          <label htmlFor={aId}>A</label>
          <input
            id={aId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={aInput}
            onChange={(e) => onAInputChange(e.target.value)}
            className="numeric-input"
            spellCheck={false}
          />
        </div>
        <div className="op-between" aria-hidden="true">
          {OPERATION_SYMBOL[operation]}
        </div>
        <div className="input-row">
          <label htmlFor={bId}>B</label>
          <input
            id={bId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={bInput}
            onChange={(e) => onBInputChange(e.target.value)}
            className="numeric-input"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="result" aria-live="polite">
        <div className="result-label">Result</div>
        <div className="result-value" title={String(result)}>
          {formatResult(result)}
        </div>
      </div>

      <button type="button" className="reset-btn" onClick={onReset}>
        Reset
      </button>

      <p className="hint">
        Drag the compass ring to rotate it, drag the brass hairline to aim, or
        type numbers above for precision.
      </p>
    </aside>
  );
}
