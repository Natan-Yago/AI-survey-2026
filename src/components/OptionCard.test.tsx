import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionCard, { MatrixOption } from './OptionCard';

describe('OptionCard', () => {
  it('renders the label and badge, and reflects checked state via aria-checked', () => {
    render(<OptionCard label="Test option" badge={1} checked={false} role="radio" onClick={() => {}} />);
    const btn = screen.getByRole('radio');
    expect(btn).toHaveAttribute('aria-checked', 'false');
    expect(btn).toHaveTextContent('Test option');
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('reflects checked=true', () => {
    render(<OptionCard label="Checked option" checked role="checkbox" onClick={() => {}} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<OptionCard label="Click me" checked={false} role="radio" onClick={onClick} />);
    await user.click(screen.getByRole('radio'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders inline highlighted terms (e.g. "AI") within the label', () => {
    render(<OptionCard label="Generative AI is here" checked={false} role="radio" onClick={() => {}} />);
    expect(screen.getByRole('radio')).toHaveTextContent('Generative AI is here');
  });
});

describe('MatrixOption', () => {
  it('renders label and reflects checked state', () => {
    render(<MatrixOption label="Matrix choice" checked role="checkbox" onClick={() => {}} />);
    const btn = screen.getByRole('checkbox');
    expect(btn).toHaveAttribute('aria-checked', 'true');
    expect(btn).toHaveTextContent('Matrix choice');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<MatrixOption label="Pick" checked={false} role="radio" onClick={onClick} />);
    await user.click(screen.getByRole('radio'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
