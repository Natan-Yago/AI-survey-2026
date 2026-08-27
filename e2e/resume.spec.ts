import { test, expect } from '@playwright/test';

test.describe('Resume progress', () => {
  test('Welcome shows a resume button and continues at the bookmarked question', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem(
        'ai-survey-answers-v3',
        JSON.stringify({ answers: { q1: 0, q2: 1 }, lastQuestionIndex: 2 }),
      );
    });
    await page.reload();

    const resumeButton = page.getByRole('button', { name: /המשך מהמקום/ });
    await expect(resumeButton).toBeDisabled();
    await page.getByRole('checkbox', { name: /מדיניות הפרטיות של Deloitte/ }).check();
    await expect(resumeButton).toBeEnabled();
    await resumeButton.click();
    await expect(page).toHaveURL(/#\/q\/3$/);
  });

  test('Resume recovers the furthest answered question from a stale bookmark', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem(
        'ai-survey-answers-v3',
        JSON.stringify({
          answers: { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 },
          lastQuestionIndex: 0,
        }),
      );
    });
    await page.reload();

    await page.getByRole('checkbox', { name: /מדיניות הפרטיות של Deloitte/ }).check();
    await page.getByRole('button', { name: /המשך מהמקום/ }).click();

    await expect(page).toHaveURL(/#\/q\/5$/);
  });

  test('Starting again clears saved answers before returning to Q1', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem(
        'ai-survey-answers-v3',
        JSON.stringify({ answers: { q1: 0, q2: 1 }, lastQuestionIndex: 1 }),
      );
    });
    await page.reload();

    await page.getByRole('checkbox', { name: /מדיניות הפרטיות של Deloitte/ }).check();
    await page.getByRole('button', { name: 'התחל מחדש ←' }).click();

    await expect(page).toHaveURL(/#\/q\/1$/);
    await expect(page.getByRole('radio').first()).toHaveAttribute('aria-checked', 'false');
  });

  test('Welcome shows no resume button and no restart button when there is no progress', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    await expect(page.getByRole('button', { name: 'התחל סקר ←' })).toBeDisabled();
    await expect(page.getByRole('button', { name: /המשך מהמקום/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /התחל מחדש/ })).toHaveCount(0);
  });
});
