import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders the stat figure and caption', () => {
    render(<StatCard stat="×3.2" caption="Growth forecast" icon="chart" palette={1} />);
    expect(screen.getByText('×3.2')).toBeInTheDocument();
    expect(screen.getByText('Growth forecast')).toBeInTheDocument();
  });

  it('applies the palette class to the card', () => {
    const { container } = render(<StatCard stat="10B+" caption="tokens" icon="bolt" palette={4} />);
    expect(container.querySelector('.palette-4')).toBeInTheDocument();
  });
});
