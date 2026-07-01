import { useEffect, useRef } from 'react';
import { renderInline } from '../lib/inline';
import { FACT_ICON_COMPONENTS } from '../lib/factIcons';
import type { FactIcon } from '../types';

interface FactModalProps {
  open: boolean;
  title: string;
  text: string;
  /** Heroicon token — same token as the summary benchmark card. */
  icon: FactIcon;
  /** 1..9 — pastel palette applied to the hero icon tile. */
  palette: number;
  onClose: () => void;
}

export default function FactModal({
  open,
  title,
  text,
  icon,
  palette,
  onClose,
}: FactModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const Icon = FACT_ICON_COMPONENTS[icon];

  // Focus the dismiss button when the modal opens, and close on Escape.
  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fact-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`fact-modal palette-${palette}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fact-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="fact-modal-close"
          onClick={onClose}
          aria-label="סגירה"
        >
          ×
        </button>
        <p className="fact-modal-kicker">הידעת?</p>
        <span className="fact-modal-icon-tile" aria-hidden="true">
          <Icon className="fact-modal-icon-svg" strokeWidth={1.75} />
        </span>
        <h2 id="fact-modal-title" className="fact-modal-title">{renderInline(title)}</h2>
        <p className="fact-modal-body">{renderInline(text)}</p>
        <div className="fact-modal-actions">
          <button
            ref={closeButtonRef}
            type="button"
            className="btn-accent"
            onClick={onClose}
          >
            המשך ←
          </button>
        </div>
      </div>
    </div>
  );
}

