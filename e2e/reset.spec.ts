import { test, expect } from '@playwright/test';

test.describe('Reset survey', () => {
  test('resetting on the Summary page clears storage and returns to Welcome', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem(
        'ai-survey-answers-v1',
        JSON.stringify({ answers: { q16: 4, q18: 4 }, lastQuestionIndex: 31 }),
      );
    });
    await page.goto('/#/summary');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: '→ התחל סקר חדש' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: 'התחל סקר ←' })).toBeVisible();

    const stored = await page.evaluate(() => localStorage.getItem('ai-survey-answers-v1'));
    expect(stored === null || JSON.parse(stored).answers).toEqual({});
  });
});
