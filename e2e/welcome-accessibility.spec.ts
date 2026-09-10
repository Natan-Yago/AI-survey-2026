import { test, expect } from '@playwright/test';

test.describe('Welcome page accessibility', () => {
  test('renders both description paragraphs with identical styles', async ({ page }) => {
    await page.goto('/');

    const paragraphStyles = await page.locator('.welcome-copy > p').evaluateAll((paragraphs) => (
      paragraphs.map((paragraph) => {
        const style = getComputedStyle(paragraph);
        return {
          color: style.color,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          marginBottom: style.marginBottom,
        };
      })
    ));

    expect(paragraphStyles).toHaveLength(2);
    expect(paragraphStyles[1]).toEqual(paragraphStyles[0]);
  });

  test('keeps the title on exactly two fitted lines across viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 1440, height: 900 },
      { width: 1280, height: 768 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 },
      { width: 320, height: 568 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const title = page.getByRole('heading', {
        level: 1,
        name: 'AI Transformation Readiness Index',
      });
      const lineMetrics = await title.locator('.welcome-title-line').evaluateAll((lines) => {
        const titleWidth = lines[0]?.parentElement?.getBoundingClientRect().width ?? 0;
        return lines.map((line) => {
          const range = document.createRange();
          range.selectNodeContents(line);
          const rects = [...range.getClientRects()];
          return {
            text: line.textContent,
            rectCount: rects.length,
            width: rects[0]?.width ?? 0,
            titleWidth,
          };
        });
      });

      expect(lineMetrics.map(({ text }) => text)).toEqual([
        'AI Transformation',
        'Readiness Index',
      ]);
      expect(lineMetrics.every(({ rectCount }) => rectCount === 1)).toBe(true);
      expect(lineMetrics.every(({ width, titleWidth }) => width <= titleWidth + 1)).toBe(true);
    }
  });

  test('keeps the logo clear and the CTA reachable in a magnified desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto('/');

    const logo = page.getByRole('img', { name: 'Deloitte' });
    const title = page.getByRole('heading', {
      level: 1,
      name: 'AI Transformation Readiness Index',
    });
    const logoBox = await logo.boundingBox();
    const titleTextBox = await title.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const { x, y, width, height } = range.getBoundingClientRect();
      return { x, y, width, height };
    });

    expect(logoBox).not.toBeNull();
    if (!logoBox) return;

    const separatedHorizontally = titleTextBox.x >= logoBox.x + logoBox.width + 16;
    const separatedVertically = titleTextBox.y >= logoBox.y + logoBox.height + 16;
    expect(separatedHorizontally || separatedVertically).toBe(true);

    const consent = page.getByRole('checkbox', { name: /מדיניות הפרטיות של Deloitte/ });
    await consent.scrollIntoViewIfNeeded();
    await consent.check();

    const startButton = page.getByRole('button', { name: 'למענה ←' });
    await expect(startButton).toBeVisible();
    await startButton.click();
    await expect(page).toHaveURL(/#\/q\/1$/);
  });
});