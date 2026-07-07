import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatrixTable from './MatrixTable';

const rows = ['Row A', 'Row B'];
const columns = ['Col 1', 'Col 2'];

describe('MatrixTable', () => {
  it('renders a group with the given aria-label and all row/column headers', () => {
    render(
      <MatrixTable
        rows={rows}
        columns={columns}
        role="radio"
        ariaLabel="My matrix"
        isChecked={() => false}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByRole('group', { name: 'My matrix' })).toBeInTheDocument();
    expect(screen.getAllByText('Row A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Row B').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Col 1').length).toBeGreaterThan(0);
  });

  it('marks the desktop cell aria-checked according to isChecked()', () => {
    render(
      <MatrixTable
        rows={rows}
        columns={columns}
        role="radio"
        ariaLabel="My matrix"
        isChecked={(r, c) => r === 0 && c === 1}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Row A: Col 2' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Row A: Col 1' })).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onSelect with the correct row/column indices when a desktop cell is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <MatrixTable
        rows={rows}
        columns={columns}
        role="checkbox"
        ariaLabel="My matrix"
        isChecked={() => false}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Row B: Col 1' }));
    expect(onSelect).toHaveBeenCalledWith(1, 0);
  });

  it('renders a native <select> per row for the mobile dropdown variant and calls onSelect on change', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <MatrixTable
        rows={rows}
        columns={columns}
        role="radio"
        ariaLabel="My matrix"
        isChecked={() => false}
        onSelect={onSelect}
        mobileVariant="dropdown"
      />,
    );
    const select = screen.getByLabelText('Row A') as HTMLSelectElement;
    await user.selectOptions(select, '1');
    expect(onSelect).toHaveBeenCalledWith(0, 1);
  });

  it('renders mobile option buttons for the "cards" variant', () => {
    render(
      <MatrixTable
        rows={rows}
        columns={columns}
        role="checkbox"
        ariaLabel="My matrix"
        isChecked={() => false}
        onSelect={() => {}}
        mobileVariant="cards"
      />,
    );
    // Cards variant renders columns as buttons grouped under each row's mobile section.
    const groups = screen.getAllByRole('group', { name: 'Row A' });
    expect(groups.length).toBeGreaterThan(0);
  });
});
