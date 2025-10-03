import { test, expect } from '@playwright/test';

test.describe('Content Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should open modal when content card is clicked', async ({ page }) => {
    // Click first content card
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    // Modal should appear
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
  });

  test('should display all content details in modal', async ({ page }) => {
    // Click first content card
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Should have title
    await expect(modal.locator('h2')).not.toBeEmpty();

    // Should have description
    await expect(modal.locator('p')).not.toBeEmpty();

    // Should have genre
    await expect(modal.getByText(/genre/i)).toBeVisible();

    // Should have rating
    await expect(modal.getByText(/rating/i)).toBeVisible();

    // Should have cast
    await expect(modal.getByText(/cast/i)).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby');
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Click close button
    const closeButton = page.getByLabel(/close/i);
    await closeButton.click();

    // Modal should disappear
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when backdrop is clicked', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Click backdrop (the dialog element itself)
    await modal.click({ position: { x: 5, y: 5 } });

    // Modal should disappear
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when Escape key is pressed', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Modal should disappear
    await expect(modal).not.toBeVisible();
  });

  test('should not close modal when clicking modal content', async ({
    page,
  }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Click on modal content (title)
    await modal.locator('h2').click();

    // Modal should still be visible
    await expect(modal).toBeVisible();
  });

  test('should focus close button when modal opens', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Close button should be focused
    const closeButton = page.getByLabel(/close/i);
    await expect(closeButton).toBeFocused();
  });

  test('should lock body scroll when modal is open', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Check body overflow style
    const bodyOverflow = await page.evaluate(
      () => document.body.style.overflow,
    );
    expect(bodyOverflow).toBe('hidden');
  });

  test('should restore body scroll when modal is closed', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Close modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();

    // Check body overflow is restored
    const bodyOverflow = await page.evaluate(
      () => document.body.style.overflow,
    );
    expect(bodyOverflow).toBe('unset');
  });

  test('should have Play button in modal', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Play button should be visible
    const playButton = modal.getByRole('button', { name: /^play$/i });
    await expect(playButton).toBeVisible();
  });

  test('should display rating as percentage', async ({ page }) => {
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await firstCard.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Should have "% Match" text
    await expect(modal.getByText(/% match/i)).toBeVisible();
  });
});
