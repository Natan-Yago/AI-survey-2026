import { useEffect, useRef } from 'react';
import { renderInline } from '../lib/inline';

interface FactModalProps {
  open: boolean;
  title: string;
  text: string;
  onClose: () => void;
}

export default function FactModal({ open, title, text, onClose }: FactModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
        className="fact-modal"
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
        <p className="fact-modal-kicker">ידעת?</p>
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
