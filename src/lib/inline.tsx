// Highlight English / technical terms inside Hebrew text so they render in
// the latin variant. Returns an array of React-friendly tokens.
import { Fragment } from 'react';

const TERMS = [
  'Agentic AI', 'Generative AI', 'AI First', 'Data Science', 'Private Equity',
  'AI/ML', 'GenAI', 'AI', 'IT', 'HR', 'DevOps', 'APIs', 'POC', 'VP', 'EVP',
  'SVP', 'COO', 'CFO', 'CIO', 'CTO', 'CMO', 'CSO', 'CHRO', 'upskilling',
  'reskilling', 'enterprise stack', 'use cases', 'governance', 'gig',
  'ownership',
];

// Build a single regex that matches any term as a whole "word". Escape
// special chars and ensure longer terms (e.g. "Agentic AI") win over short
// ones (e.g. "AI") by sorting descending by length.
const ESCAPED = TERMS.slice()
  .sort((a, b) => b.length - a.length)
  .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');
const RE = new RegExp(`(${ESCAPED})`, 'g');

export function renderInline(value: string): React.ReactNode {
  const parts = value.split(RE);
  return parts.map((part, idx) =>
    TERMS.includes(part) ? (
      <span key={idx} className="font-latin">{part}</span>
    ) : (
      <Fragment key={idx}>{part}</Fragment>
    ),
  );
}
