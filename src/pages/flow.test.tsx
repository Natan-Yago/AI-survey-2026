import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AnswersProvider } from '../state/AnswersContext';
import { surveyQuestions } from '../data/questions';
import { computeScore } from '../lib/scoring';
import type { AnswersMap } from '../types';

function renderApp(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AnswersProvider>
        <App />
      </AnswersProvider>
    </MemoryRouter>,
  );
}

describe('Survey flow (Welcome → Question → Summary)', () => {
  it('Welcome page shows the start CTA and navigates to Q1', async () => {
    const user = userEvent.setup();
    renderApp(['/']);
    const startLink = screen.getByRole('link', { name: 'התחל סקר ←' });
    await user.click(startLink);
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(surveyQuestions[0].question);
  });

  it('does not show a resume button when there is no saved progress', () => {
    renderApp(['/']);
    expect(screen.queryByRole('link', { name: /המשך מהמקום/ })).not.toBeInTheDocument();
  });

  it('shows a resume button on Welcome when progress already exists', () => {
    localStorage.setItem(
      'ai-survey-answers-v2',
      JSON.stringify({ answers: { q1: 0 }, lastQuestionIndex: 1 }),
    );
    renderApp(['/']);
    expect(screen.getByRole('link', { name: /המשך מהמקום/ })).toBeInTheDocument();
  });

  it('answering Q1 enables Next, and the selection is retained after navigating back', async () => {
    const user = userEvent.setup();
    renderApp(['/q/1']);

    const nextButton = screen.getByRole('button', { name: 'הבא ←' });
    expect(nextButton).toBeDisabled();

    const options = screen.getAllByRole('radio');
    await user.click(options[0]);
    expect(nextButton).toBeEnabled();

    await user.click(nextButton);
    // Q1 (idx 0) has no associated "fact" popup, so this should navigate directly to Q2.
    let heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(surveyQuestions[1].question);

    await user.click(screen.getByRole('button', { name: '→ הקודם' }));
    heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(surveyQuestions[0].question);
    const radiosAfterBack = screen.getAllByRole('radio');
    expect(radiosAfterBack[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('the "→ לפתיחה" back button on Q1 returns to Welcome', async () => {
    const user = userEvent.setup();
    renderApp(['/q/1']);
    await user.click(screen.getByRole('button', { name: '→ לפתיחה' }));
    expect(await screen.findByRole('link', { name: 'התחל סקר ←' })).toBeInTheDocument();
  });

  it('Q18 allows independent matrix selections and limits each column to 3', async () => {
    const user = userEvent.setup();
    renderApp(['/q/18']);

    const rows = document.querySelectorAll('.matrix-table-region tbody tr');
    const firstRowButtons = within(rows[0] as HTMLElement).getAllByRole('checkbox');
    await user.click(firstRowButtons[0]);
    await user.click(firstRowButtons[1]);
    expect(firstRowButtons[0]).toHaveAttribute('aria-checked', 'true');
    expect(firstRowButtons[1]).toHaveAttribute('aria-checked', 'true');

    await user.click(within(rows[1] as HTMLElement).getAllByRole('checkbox')[0]);
    await user.click(within(rows[2] as HTMLElement).getAllByRole('checkbox')[0]);
    const fourthChoice = within(rows[3] as HTMLElement).getAllByRole('checkbox')[0];
    await user.click(fourthChoice);

    expect(fourthChoice).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('ניתן לבחור עד 3 אפשרויות בכל עמודה.')).toBeInTheDocument();
  });

  it('Summary page renders the maturity level matching computeScore() for the persisted answers', () => {
    const answers: AnswersMap = { q17: 4, q19: 4, q23: 4, q29: 4, q30: 4, q33: 4 };
    localStorage.setItem(
      'ai-survey-answers-v2',
      JSON.stringify({ answers, lastQuestionIndex: 34 }),
    );
    const expected = computeScore(answers);
    renderApp(['/summary']);

    expect(screen.getByRole('heading', { level: 1, name: 'AI in Action' })).toBeInTheDocument();
    expect(screen.getByText(`על סמך הנתונים שמילאת הארגון שלך נמצא בשלב ${expected.level.id}`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: `Level ${expected.level.id} - ${expected.level.nameEn}` })).toBeInTheDocument();
    expect(screen.getByText(expected.average.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(`${expected.count} answers scored`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: "בנצ'מרק עולמי · Deloitte 2026" })).toBeInTheDocument();
    expect(document.querySelectorAll('.stat-card')).toHaveLength(10);
    expect(screen.getByText('21%')).toBeInTheDocument();
    expect(screen.getByText('23% → 74%')).toHaveAttribute('dir', 'ltr');
    expect(screen.getByText('23% → 74%').parentElement).not.toHaveAttribute('dir');
    expect(document.querySelector('.summary-hero')).toHaveClass('summary-glass-card');
    expect(document.querySelectorAll('.maturity-content-block.summary-glass-card')).toHaveLength(3);
    expect(document.querySelectorAll('.stat-card.summary-glass-card')).toHaveLength(10);
    expect(document.querySelectorAll('.expert-card.summary-glass-card')).toHaveLength(2);

    const journey = screen.getByLabelText('שלב במסע ה-AI');
    ['Exploring', 'Building', 'Scaling', 'Transforming', 'AI-First'].forEach((name) => {
      expect(within(journey).getByText(name)).toBeInTheDocument();
    });
    ['בוחנים', 'בונים', 'מרחיבים', 'משנים', 'מובילים'].forEach((name) => {
      expect(within(journey).queryByText(name)).not.toBeInTheDocument();
    });
    expect(screen.queryByText('השאלה הניהולית המרכזית')).not.toBeInTheDocument();
  });

  it('Summary page shows a "-" placeholder score when there are no scored answers', () => {
    renderApp(['/summary']);
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('Level 1 - Exploring')).toBeInTheDocument();
  });
});
