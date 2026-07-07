import { test, expect, type Page } from '@playwright/test';

async function clearStorage(page: Page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Answers the currently rendered question in a layout-agnostic way by
 * clicking the first available option in each question type's DOM shape:
 *  - single / multi:            `div.space-y-3[role]` → first `button[role]`
 *  - matrix (table layout):     `.matrix-table-region tbody tr` → first cell button per row
 *  - matrix (list/card layout): `.matrix-list section.matrix-row` → first choice button per row
 */
async function answerCurrentQuestion(page: Page) {
  const singleOrMulti = page.locator('div.space-y-3[role]');
  if ((await singleOrMulti.count()) > 0) {
    await singleOrMulti.locator('button[role]').first().click();
    return;
  }

  const tableRegion = page.locator('.matrix-table-region');
  if ((await tableRegion.count()) > 0) {
    const rows = tableRegion.locator('tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      await rows.nth(i).locator('button[role]').first().click();
    }
    return;
  }

  const matrixList = page.locator('.matrix-list');
  if ((await matrixList.count()) > 0) {
    const sections = matrixList.locator('section.matrix-row');
    const sectionCount = await sections.count();
    for (let i = 0; i < sectionCount; i++) {
      await sections.nth(i).locator('.matrix-choice-grid button[role]').first().click();
    }
    return;
  }

  throw new Error('Unrecognized question layout — none of the expected containers were found.');
}

/** Clicks Next/Finish and dismisses the "הידעת?" fact popup if it appears. */
async function goToNextQuestion(page: Page) {
  await page.getByRole('button', { name: /הבא ←|סיום ←/ }).click();
  const modal = page.locator('.fact-modal');
  if (await modal.isVisible().catch(() => false)) {
    await page.getByRole('button', { name: 'המשך ←' }).click();
  }
}

test.describe('Full survey journey', () => {
  test('Welcome → answering all 32 questions → Summary shows a maturity level and score', async ({ page }) => {
    await clearStorage(page);

    await page.getByRole('link', { name: 'התחל סקר ←' }).click();
    await expect(page).toHaveURL(/#\/q\/1$/);

    for (let i = 0; i < 32; i++) {
      await answerCurrentQuestion(page);
      await goToNextQuestion(page);
    }

    await expect(page).toHaveURL(/#\/summary$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/answers scored/)).toBeVisible();
    // Score figure should be a real number (not the "—" placeholder) once answers exist.
    await expect(page.locator('.score-num')).not.toHaveText('—');
  });

  test('Previous/Next navigation preserves the selected answer', async ({ page }) => {
    await clearStorage(page);
    await page.getByRole('link', { name: 'התחל סקר ←' }).click();

    const firstOption = page.locator('div.space-y-3[role] button[role]').first();
    await firstOption.click();
    await expect(firstOption).toHaveAttribute('aria-checked', 'true');

    await page.getByRole('button', { name: 'הבא ←' }).click();
    await expect(page).toHaveURL(/#\/q\/2$/);

    await page.getByRole('button', { name: '→ הקודם' }).click();
    await expect(page).toHaveURL(/#\/q\/1$/);
    await expect(page.locator('div.space-y-3[role] button[role]').first()).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  test('Next is disabled until the question is answered', async ({ page }) => {
    await clearStorage(page);
    await page.getByRole('link', { name: 'התחל סקר ←' }).click();
    await expect(page.getByRole('button', { name: 'הבא ←' })).toBeDisabled();
  });
});
