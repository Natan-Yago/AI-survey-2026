import { test, expect } from '@playwright/test';

test.describe('Resume progress', () => {
  test('Welcome shows a resume button and continues at the bookmarked question', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem(
        'ai-survey-answers-v2',
        JSON.stringify({ answers: { q1: 0, q2: 1 }, lastQuestionIndex: 2 }),
      );
    });
    await page.reload();

    const resumeLink = page.getByRole('link', { name: /המשך מהמקום/ });
    await expect(resumeLink).toBeVisible();
    await resumeLink.click();
    await expect(page).toHaveURL(/#\/q\/3$/);
  });

  test('Welcome shows no resume button and no restart button when there is no progress', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();

    await expect(page.getByRole('link', { name: 'התחל סקר ←' })).toBeVisible();
    await expect(page.getByRole('link', { name: /המשך מהמקום/ })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /התחל מחדש/ })).toHaveCount(0);
  });
});
