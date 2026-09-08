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
    expect(screen.getByText('מידע על הסקר')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'מדד בשלות ואימוץ AI בארגונים' })).toBeInTheDocument();
    const consentCheckbox = screen.getByRole('checkbox', { name: /מדיניות הפרטיות של Deloitte/ });
    const startButton = screen.getByRole('button', { name: 'למענה ←' });
    expect(startButton).toBeDisabled();

    await user.click(consentCheckbox);
    expect(startButton).toBeEnabled();
    await user.click(startButton);
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(surveyQuestions[0].question);
  });

  it('does not show a resume button when there is no saved progress', () => {
    renderApp(['/']);
    expect(screen.queryByRole('button', { name: /המשך מהמקום/ })).not.toBeInTheDocument();
  });

  it('shows a resume button on Welcome when progress already exists', () => {
    localStorage.setItem(
      'ai-survey-answers-v4',
      JSON.stringify({ answers: { q1: 0 }, lastQuestionIndex: 1 }),
    );
    renderApp(['/']);
    expect(screen.getByRole('button', { name: /המשך מהמקום/ })).toBeDisabled();
  });

  it('resumes at the furthest answered question when the saved bookmark is stale', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'ai-survey-answers-v4',
      JSON.stringify({
        answers: { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 },
        lastQuestionIndex: 0,
      }),
    );
    renderApp(['/']);

    await user.click(screen.getByRole('checkbox', { name: /מדיניות הפרטיות של Deloitte/ }));
    await user.click(screen.getByRole('button', { name: /המשך מהמקום/ }));

    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(surveyQuestions[4].question);
  });

  it('starting again clears previous answers before opening Q1', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'ai-survey-answers-v4',
      JSON.stringify({ answers: { q1: 0, q2: 1 }, lastQuestionIndex: 1 }),
    );
    renderApp(['/']);

    await user.click(screen.getByRole('checkbox', { name: /מדיניות הפרטיות של Deloitte/ }));
    await user.click(screen.getByRole('button', { name: 'התחל מחדש ←' }));

    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(surveyQuestions[0].question);
    expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-checked', 'false');
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
    expect(await screen.findByRole('button', { name: 'למענה ←' })).toBeDisabled();
  });

  it('Q7 matrix-single replaces only the selected row in desktop and mobile layouts', async () => {
    const user = userEvent.setup();
    renderApp(['/q/7']);

    const rows = document.querySelectorAll('.matrix-table-shell tbody tr');
    const firstRowChoices = within(rows[0] as HTMLElement).getAllByRole('radio');
    const secondRowChoices = within(rows[1] as HTMLElement).getAllByRole('radio');
    await user.click(firstRowChoices[1]);
    await user.click(secondRowChoices[2]);

    const mobileSelects = document.querySelectorAll<HTMLSelectElement>('.matrix-mobile-select');
    expect(mobileSelects[0].value).toBe('1');
    expect(mobileSelects[1].value).toBe('2');

    await user.selectOptions(mobileSelects[0], '3');
    expect(firstRowChoices[1]).toHaveAttribute('aria-checked', 'false');
    expect(firstRowChoices[3]).toHaveAttribute('aria-checked', 'true');
    expect(secondRowChoices[2]).toHaveAttribute('aria-checked', 'true');
  });

  it('Q13 enforces matrix-multi limits independently for each column', async () => {
    const user = userEvent.setup();
    renderApp(['/q/13']);

    const rows = document.querySelectorAll('.matrix-table-shell tbody tr');
    const firstRowChoices = within(rows[0] as HTMLElement).getAllByRole('checkbox');
    await user.click(firstRowChoices[0]);
    await user.click(within(rows[1] as HTMLElement).getAllByRole('checkbox')[0]);
    await user.click(within(rows[2] as HTMLElement).getAllByRole('checkbox')[0]);
    await user.click(firstRowChoices[1]);

    const fourthInFirstColumn = within(rows[3] as HTMLElement).getAllByRole('checkbox')[0];
    await user.click(fourthInFirstColumn);
    expect(fourthInFirstColumn).toHaveAttribute('aria-checked', 'false');
    expect(firstRowChoices[1]).toHaveAttribute('aria-checked', 'true');

    await user.click(within(rows[1] as HTMLElement).getAllByRole('checkbox')[0]);
    expect(firstRowChoices[0]).toHaveAttribute('aria-checked', 'true');
    expect(firstRowChoices[1]).toHaveAttribute('aria-checked', 'true');
    await user.click(fourthInFirstColumn);
    expect(fourthInFirstColumn).toHaveAttribute('aria-checked', 'true');
  });

  it('Q15 enforces its max while deselection leaves unrelated choices intact', async () => {
    const user = userEvent.setup();
    renderApp(['/q/15']);

    const options = screen.getAllByRole('checkbox');
    await user.click(options[0]);
    await user.click(options[1]);
    await user.click(options[2]);
    await user.click(options[3]);
    expect(options[3]).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('ניתן לבחור עד 3 אפשרויות.')).toBeInTheDocument();

    await user.click(options[1]);
    expect(options[0]).toHaveAttribute('aria-checked', 'true');
    expect(options[1]).toHaveAttribute('aria-checked', 'false');
    expect(options[2]).toHaveAttribute('aria-checked', 'true');
    await user.click(options[3]);
    expect(options[3]).toHaveAttribute('aria-checked', 'true');
  });

  it('Q17 allows independent matrix selections and limits each column to 3', async () => {
    const user = userEvent.setup();
    renderApp(['/q/17']);

    const rows = document.querySelectorAll('.matrix-table-region tbody tr');
    const firstRowButtons = within(rows[0] as HTMLElement).getAllByRole('checkbox');
    await user.click(firstRowButtons[0]);
    await user.click(firstRowButtons[1]);
    expect(firstRowButtons[0]).toHaveAttribute('aria-checked', 'true');
    expect(firstRowButtons[1]).toHaveAttribute('aria-checked', 'true');

    const mobileRows = document.querySelectorAll('.matrix-mobile-row');
    const firstMobileRowButtons = within(mobileRows[0] as HTMLElement).getAllByRole('checkbox');
    expect(firstMobileRowButtons[0]).toHaveAttribute('aria-checked', 'true');
    expect(firstMobileRowButtons[1]).toHaveAttribute('aria-checked', 'true');

    await user.click(within(rows[1] as HTMLElement).getAllByRole('checkbox')[0]);
    await user.click(within(rows[2] as HTMLElement).getAllByRole('checkbox')[0]);
    const fourthChoice = within(rows[3] as HTMLElement).getAllByRole('checkbox')[0];
    await user.click(fourthChoice);

    expect(fourthChoice).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('ניתן לבחור עד 3 אפשרויות בכל עמודה.')).toBeInTheDocument();

    const exclusiveChoice = within(rows[7] as HTMLElement).getAllByRole('checkbox')[0];
    await user.click(exclusiveChoice);
    expect(exclusiveChoice).toHaveAttribute('aria-checked', 'true');
    expect(firstRowButtons[0]).toHaveAttribute('aria-checked', 'false');

    await user.click(firstRowButtons[0]);
    expect(firstRowButtons[0]).toHaveAttribute('aria-checked', 'true');
    expect(exclusiveChoice).toHaveAttribute('aria-checked', 'false');

    const futureExclusiveChoice = within(rows[7] as HTMLElement).getAllByRole('checkbox')[1];
    await user.click(futureExclusiveChoice);
    expect(futureExclusiveChoice).toHaveAttribute('aria-checked', 'true');
    expect(firstRowButtons[1]).toHaveAttribute('aria-checked', 'true');

    await user.click(firstRowButtons[1]);
    expect(firstRowButtons[1]).toHaveAttribute('aria-checked', 'false');
    expect(futureExclusiveChoice).toHaveAttribute('aria-checked', 'true');
  });

  it('Q17 ignores a stale answer with the wrong shape instead of crashing', () => {
    localStorage.setItem(
      'ai-survey-answers-v4',
      JSON.stringify({ answers: { q17: 3 }, lastQuestionIndex: 16 }),
    );

    renderApp(['/q/17']);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'בהתייחס לתועלות מיוזמות ה-AI בארגון',
    );
    expect(screen.getByRole('button', { name: 'הבא ←' })).toBeDisabled();
  });

  it('Q17 removes malformed persisted keys and remains interactive', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'ai-survey-answers-v4',
      JSON.stringify({
        answers: { q17: ['0:0', 1, 'bad:0', '8:0'] },
        lastQuestionIndex: 16,
      }),
    );

    renderApp(['/q/17']);

    const rows = document.querySelectorAll('.matrix-table-shell tbody tr');
    const firstChoice = within(rows[0] as HTMLElement).getAllByRole('checkbox')[0];
    const secondChoice = within(rows[1] as HTMLElement).getAllByRole('checkbox')[0];
    expect(firstChoice).toHaveAttribute('aria-checked', 'true');
    await user.click(secondChoice);
    expect(firstChoice).toHaveAttribute('aria-checked', 'true');
    expect(secondChoice).toHaveAttribute('aria-checked', 'true');
  });

  it('Q19 matrix-column-single replaces only the selected column across layouts', async () => {
    const user = userEvent.setup();
    renderApp(['/q/19']);

    const rows = document.querySelectorAll('.matrix-table-shell tbody tr');
    const todayChoices = within(rows[0] as HTMLElement).getAllByRole('radio');
    const futureChoices = within(rows[1] as HTMLElement).getAllByRole('radio');
    await user.click(todayChoices[0]);
    await user.click(futureChoices[1]);

    const mobileSelects = document.querySelectorAll<HTMLSelectElement>('.matrix-mobile-select');
    expect(mobileSelects[0].value).toBe('0');
    expect(mobileSelects[1].value).toBe('1');

    await user.selectOptions(mobileSelects[1], '2');
    expect(todayChoices[0]).toHaveAttribute('aria-checked', 'true');
    expect(futureChoices[1]).toHaveAttribute('aria-checked', 'false');
    expect(futureChoices[2]).toHaveAttribute('aria-checked', 'true');
  });

  it('Q19 does not treat malformed persisted prompt keys as complete', () => {
    localStorage.setItem(
      'ai-survey-answers-v4',
      JSON.stringify({ answers: { q19: { 8: 0, 9: 1 } }, lastQuestionIndex: 18 }),
    );

    renderApp(['/q/19']);

    expect(screen.getByRole('button', { name: 'הבא ←' })).toBeDisabled();
    document.querySelectorAll('.matrix-table-shell [role="radio"]').forEach((choice) => {
      expect(choice).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('Q21 keeps no-concerns and unknown exclusive from every specific risk', async () => {
    const user = userEvent.setup();
    renderApp(['/q/21']);

    const options = screen.getAllByRole('checkbox');
    expect(options).toHaveLength(9);

    const privacy = screen.getByRole('checkbox', { name: /פרטיות/ });
    const workforce = screen.getByRole('checkbox', { name: /השפעה על כוח האדם/ });
    const noConcerns = screen.getByRole('checkbox', { name: /לא זוהו אצלנו חששות/ });
    const unknown = screen.getByRole('checkbox', { name: /לא יודע\/ת/ });

    await user.click(privacy);
    await user.click(workforce);
    await user.click(noConcerns);
    expect(privacy).toHaveAttribute('aria-checked', 'false');
    expect(workforce).toHaveAttribute('aria-checked', 'false');
    expect(noConcerns).toHaveAttribute('aria-checked', 'true');

    await user.click(unknown);
    expect(noConcerns).toHaveAttribute('aria-checked', 'false');
    expect(unknown).toHaveAttribute('aria-checked', 'true');

    await user.click(workforce);
    expect(unknown).toHaveAttribute('aria-checked', 'false');
    expect(workforce).toHaveAttribute('aria-checked', 'true');
  });

  it('Q24 matrix-column-single keeps other columns when a mobile selection changes', async () => {
    const user = userEvent.setup();
    renderApp(['/q/24']);

    const rows = document.querySelectorAll('.matrix-list .matrix-row');
    const firstColumnChoices = within(rows[0] as HTMLElement).getAllByRole('radio');
    const secondColumnChoices = within(rows[1] as HTMLElement).getAllByRole('radio');
    const firstColumnSelect = within(rows[0] as HTMLElement).getByRole('combobox') as HTMLSelectElement;
    await user.click(firstColumnChoices[0]);
    await user.click(secondColumnChoices[1]);
    expect(firstColumnSelect.value).toBe('0');

    await user.selectOptions(firstColumnSelect, '2');
    expect(firstColumnChoices[0]).toHaveAttribute('aria-checked', 'false');
    expect(firstColumnChoices[2]).toHaveAttribute('aria-checked', 'true');
    expect(secondColumnChoices[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('Summary page renders the maturity level matching computeScore() for the persisted answers', () => {
    const answers: AnswersMap = { q16: 4, q18: 4, q22: 4, q28: 4, q29: 4, q32: 4 };
    localStorage.setItem(
      'ai-survey-answers-v4',
      JSON.stringify({ answers, lastQuestionIndex: 33 }),
    );
    const expected = computeScore(answers);
    renderApp(['/summary']);

    expect(screen.queryByText('AI in Action')).not.toBeInTheDocument();
    expect(screen.getByText(`על סמך הנתונים שמילאת הארגון שלך נמצא בשלב ${expected.level.id}`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: `Level ${expected.level.id} - ${expected.level.nameEn}` })).toBeInTheDocument();
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
    expect(screen.getByText(/אינן מהוות דירוג, הערכה מקצועית/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'כיווני התקדמות אפשריים' })).toBeInTheDocument();

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
