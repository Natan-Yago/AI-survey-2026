import { renderInline } from '../lib/inline';

interface MatrixTableProps {
  rows: string[];
  columns: string[];
  role: 'radio' | 'checkbox';
  ariaLabel: string;
  isChecked: (rowIndex: number, columnIndex: number) => boolean;
  onSelect: (rowIndex: number, columnIndex: number) => void;
  /**
   * How the mobile (< 640px) layout renders. Defaults to `'dropdown'` for
   * radio matrices (native <select> per row → OS bottom-sheet picker) and
   * `'cards'` for checkbox matrices (a single <select> can't represent
   * multi-select). Callers can force `'cards'` on a radio matrix whose
   * card layout reads better on mobile (e.g. Q10).
   */
  mobileVariant?: 'dropdown' | 'cards';
}

export default function MatrixTable({
  rows,
  columns,
  role,
  ariaLabel,
  isChecked,
  onSelect,
  mobileVariant,
}: MatrixTableProps) {
  const markerClass = role === 'radio' ? 'option-radio' : 'option-check';
  const resolvedMobileVariant: 'dropdown' | 'cards' =
    mobileVariant ?? (role === 'radio' ? 'dropdown' : 'cards');

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
        {rows.map((rowLabel, rowIndex) => {
          if (resolvedMobileVariant === 'dropdown') {
            // Find which column (if any) is currently selected for this row.
            const selectedColumn = columns.findIndex((_, columnIndex) =>
              isChecked(rowIndex, columnIndex),
            );
            const selectValue = selectedColumn === -1 ? '' : String(selectedColumn);
            return (
              <section key={rowIndex} className="matrix-mobile-row">
                <h2 className="matrix-row-title">{renderInline(rowLabel)}</h2>
                <select
                  className="matrix-mobile-select"
                  aria-label={rowLabel}
                  required
                  value={selectValue}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') return;
                    onSelect(rowIndex, Number(raw));
                  }}
                >
                  <option value="" disabled hidden>
                    בחר/י אפשרות
                  </option>
                  {columns.map((columnLabel, columnIndex) => (
                    <option key={columnIndex} value={columnIndex}>
                      {columnLabel}
                    </option>
                  ))}
                </select>
              </section>
            );
          }

          return (
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
          );
        })}
      </div>
    </div>
  );
}
