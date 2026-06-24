import { renderInline } from '../lib/inline';

interface MatrixTableProps {
  rows: string[];
  columns: string[];
  role: 'radio' | 'checkbox';
  ariaLabel: string;
  isChecked: (rowIndex: number, columnIndex: number) => boolean;
  onSelect: (rowIndex: number, columnIndex: number) => void;
}

export default function MatrixTable({
  rows,
  columns,
  role,
  ariaLabel,
  isChecked,
  onSelect,
}: MatrixTableProps) {
  const markerClass = role === 'radio' ? 'option-radio' : 'option-check';

  return (
    <div className="matrix-table-region" role="group" aria-label={ariaLabel}>
      <div className="matrix-table-shell">
        <table className="matrix-answer-table">
          <thead>
            <tr>
              <th scope="col" className="matrix-table-corner"></th>
              {columns.map((columnLabel, columnIndex) => (
                <th key={columnIndex} scope="col" className="matrix-table-column-label">
                  {renderInline(columnLabel)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowLabel, rowIndex) => (
              <tr key={rowIndex}>
                <th scope="row" className="matrix-table-row-label">
                  {renderInline(rowLabel)}
                </th>
                {columns.map((columnLabel, columnIndex) => {
                  const checked = isChecked(rowIndex, columnIndex);
                  return (
                    <td key={columnIndex} className="matrix-table-cell">
                      <button
                        type="button"
                        role={role}
                        aria-checked={checked}
                        aria-label={`${rowLabel}: ${columnLabel}`}
                        onClick={() => onSelect(rowIndex, columnIndex)}
                        className="option-card matrix-table-choice"
                      >
                        <span className={markerClass} aria-hidden="true"></span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="matrix-mobile-list">
        {rows.map((rowLabel, rowIndex) => (
          <section key={rowIndex} className="matrix-mobile-row">
            <h2 className="matrix-row-title">{renderInline(rowLabel)}</h2>
            <div className="matrix-mobile-options" role={role === 'radio' ? 'radiogroup' : 'group'} aria-label={rowLabel}>
              {columns.map((columnLabel, columnIndex) => {
                const checked = isChecked(rowIndex, columnIndex);
                return (
                  <button
                    key={columnIndex}
                    type="button"
                    role={role}
                    aria-checked={checked}
                    onClick={() => onSelect(rowIndex, columnIndex)}
                    className="option-card matrix-mobile-option"
                  >
                    <span className="matrix-option-label">{renderInline(columnLabel)}</span>
                    <span className={markerClass} aria-hidden="true"></span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}