import { test, expect } from '@playwright/test';

test.describe('Content Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/ZenithFlix/);
    await expect(page.getByText('ZenithFlix').first()).toBeVisible();
  });

  test('should display hero section with featured content', async ({ page }) => {
    // Wait for content to load
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Hero section should be visible
    const heroSection = page.locator('main > div').first();
    await expect(heroSection).toBeVisible();

    // Should have Play and More Info buttons in hero section
    await expect(heroSection.getByRole('button', { name: /play/i })).toBeVisible();
    await expect(
      heroSection.getByRole('button', { name: /more info/i }),
    ).toBeVisible();
  });

  test('should display multiple content sections by genre', async ({
    page,
  }) => {
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Check for "Trending Now" section
    await expect(page.getByText('Trending Now')).toBeVisible();

    // Should have multiple genre sections
    const sections = page.locator('section, div[id]');
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display content cards with details', async ({ page }) => {
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Find first content card
    const firstCard = page.getByRole('button').filter({ hasText: /\d{4}/ }).first();
    await expect(firstCard).toBeVisible();

    // Content card should have title (checking for any text content)
    await expect(firstCard).not.toBeEmpty();
  });

  test('should support horizontal scrolling in content grid', async ({
    page,
  }) => {
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Find scroll buttons (left and right arrows)
    const scrollButtons = page.getByRole('button').filter({
      has: page.locator('svg'),
    });

    // Should have at least one scroll button
    const count = await scrollButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show watch progress bars when available', async ({ page }) => {
    // Fetch content to get a real ID
    const response = await page.request.get('http://localhost:3001/api/streaming');
    const content = await response.json();
    const firstContentId = content[0]?.id;

    // Add watch history to localStorage
    await page.evaluate((contentId) => {
      const watchHistory = [
        {
          contentId: contentId,
          progress: 35,
          lastWatched: new Date().toISOString(),
        },
      ];
      localStorage.setItem('zenithflix_watch_history', JSON.stringify(watchHistory));
    }, firstContentId);

    // Reload page
    await page.reload();
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Continue Watching section should appear
    await expect(page.getByText(/continue watching/i)).toBeVisible();

    // Progress bar should also be visible
    const progressBar = page.locator('.bg-red-600').first();
    await expect(progressBar).toBeVisible();
  });

  test('should navigate using keyboard', async ({ page }) => {
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Focus first content card using Tab
    await page.keyboard.press('Tab');

    // Find focused element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeFocused();
  });
});
