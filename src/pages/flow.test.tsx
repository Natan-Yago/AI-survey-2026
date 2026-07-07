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
      'ai-survey-answers-v1',
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

  it('Summary page renders the maturity level matching computeScore() for the persisted answers', () => {
    const answers: AnswersMap = { q16: 4, q18: 4, q20: 4, q26: 4, q27: 4, q30: 4 };
    localStorage.setItem(
      'ai-survey-answers-v1',
      JSON.stringify({ answers, lastQuestionIndex: 31 }),
    );
    const expected = computeScore(answers);
    renderApp(['/summary']);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(within(heading).getByText(expected.level.nameEn)).toBeInTheDocument();
    expect(screen.getByText(expected.average.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText(`${expected.count} answers scored`)).toBeInTheDocument();
  });

  it('Summary page shows a "—" placeholder score when there are no scored answers', () => {
    renderApp(['/summary']);
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('Level 1 - Exploring')).toBeInTheDocument();
  });
});
