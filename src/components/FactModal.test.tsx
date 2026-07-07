import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FactModal from './FactModal';

describe('FactModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <FactModal open={false} title="T" text="Body" icon="chart" palette={1} onClose={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders title and text when open, and focuses the close/continue button', () => {
    render(<FactModal open title="Investment growth" text="Details here" icon="chart" palette={2} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Investment growth')).toBeInTheDocument();
    expect(screen.getByText('Details here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'המשך ←' })).toHaveFocus();
  });

  it('calls onClose when the close (×) button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<FactModal open title="T" text="Body" icon="chart" palette={1} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'סגירה' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the continue button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<FactModal open title="T" text="Body" icon="chart" palette={1} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'המשך ←' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<FactModal open title="T" text="Body" icon="chart" palette={1} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the overlay is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <FactModal open title="T" text="Body" icon="chart" palette={1} onClose={onClose} />,
    );
    await user.click(container.querySelector('.fact-modal-overlay')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
