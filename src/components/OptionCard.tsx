import type { ReactNode } from 'react';
import { renderInline } from '../lib/inline';

interface OptionCardProps {
  label: string;
  badge?: ReactNode;
  checked: boolean;
  role: 'radio' | 'checkbox';
  onClick: () => void;
}

export default function OptionCard({ label, badge, checked, role, onClick }: OptionCardProps) {
  const markerClass = role === 'radio' ? 'option-radio' : 'option-check';
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      onClick={onClick}
      className="option-card surface-card w-full text-start p-4 flex items-center gap-4"
      style={{ background: 'rgba(254, 255, 251, 0.95)' }}
    >
      {badge !== undefined && <span className="kbd-badge font-latin">{badge}</span>}
      <span className="flex-1 text-sm sm:text-base">{renderInline(label)}</span>
      <span className={markerClass} aria-hidden="true"></span>
    </button>
  );
}

export function MatrixOption({ label, checked, role, onClick }: Omit<OptionCardProps, 'badge'>) {
  const markerClass = role === 'radio' ? 'option-radio' : 'option-check';
  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      onClick={onClick}
      className="option-card matrix-option"
      style={{ background: 'rgba(254, 255, 251, 0.95)' }}
    >
      <span className="matrix-option-label">{renderInline(label)}</span>
      <span className={markerClass} aria-hidden="true"></span>
    </button>
  );
}
