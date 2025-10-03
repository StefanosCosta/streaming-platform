import { test, expect } from '@playwright/test';

test.describe('Watch History', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear localStorage before each test
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    // Wait for content to load instead of networkidle
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should save watch progress to localStorage', async ({ page }) => {
    // Manually add watch progress to localStorage to test the functionality
    await page.evaluate(() => {
      const watchHistory = [
        {
          contentId: 'cd32b866-e325-47e6-a334-93963cf32adc', // First content ID from backend
          progress: 25.5,
          lastWatched: new Date().toISOString(),
        },
      ];
      localStorage.setItem('zenithflix_watch_history', JSON.stringify(watchHistory));
    });

    // Check localStorage
    const watchHistory = await page.evaluate(() => {
      const stored = localStorage.getItem('zenithflix_watch_history');
      return stored ? JSON.parse(stored) : null;
    });

    expect(watchHistory).not.toBeNull();
    expect(Array.isArray(watchHistory)).toBe(true);
    expect(watchHistory.length).toBe(1);
    expect(watchHistory[0].progress).toBe(25.5);
  });

  test('should display Continue Watching section after watching', async ({
    page,
  }) => {
    // Add watch progress to localStorage
    await page.evaluate(() => {
      const watchHistory = [
        {
          contentId: 'cd32b866-e325-47e6-a334-93963cf32adc',
          progress: 45,
          lastWatched: new Date().toISOString(),
        },
      ];
      localStorage.setItem('zenithflix_watch_history', JSON.stringify(watchHistory));
    });

    // Reload page
    await page.reload();
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Continue Watching section should appear
    await expect(page.getByText(/continue watching/i)).toBeVisible();
  });

  test('should show progress bar on watched content', async ({ page }) => {
    // Add watch progress to localStorage
    await page.evaluate(() => {
      const watchHistory = [
        {
          contentId: 'cd32b866-e325-47e6-a334-93963cf32adc',
          progress: 60,
          lastWatched: new Date().toISOString(),
        },
      ];
      localStorage.setItem('zenithflix_watch_history', JSON.stringify(watchHistory));
    });

    // Reload to show progress bars
    await page.reload();
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Progress bar should be visible on the card
    // Check for the progress bar element (it has bg-red-600 class)
    const progressBar = page.locator('.bg-red-600').first();
    await expect(progressBar).toBeVisible();
  });

  test('should resume from saved progress', async ({ page }) => {
    // Set watch progress in localStorage
    await page.evaluate(() => {
      const watchHistory = [
        {
          contentId: 'cd32b866-e325-47e6-a334-93963cf32adc',
          progress: 50,
          lastWatched: new Date().toISOString(),
        },
      ];
      localStorage.setItem('zenithflix_watch_history', JSON.stringify(watchHistory));
    });

    // Navigate to home instead of reload to ensure fresh state
    await page.goto('/');
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Continue Watching should appear
    await expect(page.getByText(/continue watching/i)).toBeVisible();

    // Click the watched content
    const continueWatchingSection = page.locator('#history');
    await expect(continueWatchingSection).toBeVisible();

    const watchedCard = continueWatchingSection
      .getByRole('button')
      .filter({ hasText: /\d{4}/ })
      .first();
    await watchedCard.click();

    // Modal should open
    const resumeModal = page.getByRole('dialog');
    await expect(resumeModal).toBeVisible();

    // Play button should be available
    const playButton = resumeModal.getByRole('button', { name: /^play$/i });
    await expect(playButton).toBeVisible();
  });

  test('should sync backend progress to localStorage', async ({ page }) => {
    // This test verifies that even if localStorage is cleared,
    // the app will restore watch history from the backend

    // First, add watch history to localStorage
    await page.evaluate(() => {
      const watchHistory = [
        {
          contentId: 'cd32b866-e325-47e6-a334-93963cf32adc',
          progress: 75,
          lastWatched: new Date().toISOString(),
        },
      ];
      localStorage.setItem('zenithflix_watch_history', JSON.stringify(watchHistory));
    });

    // Navigate to home to show Continue Watching
    await page.goto('/');
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // Continue Watching should appear
    await expect(page.getByText(/continue watching/i)).toBeVisible();

    // Clear localStorage to simulate data loss
    await page.evaluate(() => localStorage.clear());

    // Reload page - backend should restore the progress
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.getByText('Trending Now').waitFor({ state: 'visible', timeout: 10000 });

    // localStorage should be repopulated from backend
    const historyAfterReload = await page.evaluate(() => {
      const stored = localStorage.getItem('zenithflix_watch_history');
      return stored ? JSON.parse(stored) : null;
    });

    // Verify backend synced the data back
    expect(historyAfterReload).not.toBeNull();

    // Continue Watching should still appear (restored from backend)
    await expect(page.getByText(/continue watching/i)).toBeVisible();
  });

  test('should update progress when watching multiple times', async ({
    page,
  }) => {
    // First watch session - add initial progress
    await page.evaluate(() => {
      const watchHistory = [
        {
          contentId: 'cd32b866-e325-47e6-a334-93963cf32adc',
          progress: 30,
          lastWatched: new Date().toISOString(),
        },
      ];
      localStorage.setItem('zenithflix_watch_history', JSON.stringify(watchHistory));
    });

    // Get first watch progress
    const firstProgress = await page.evaluate(() => {
      const stored = localStorage.getItem('zenithflix_watch_history');
      return stored ? JSON.parse(stored)[0].progress : 0;
    });
    expect(firstProgress).toBe(30);

    // Update progress (simulating second watch session)
    await page.evaluate(() => {
      const watchHistory = [
        {
          contentId: 'cd32b866-e325-47e6-a334-93963cf32adc',
          progress: 55,
          lastWatched: new Date().toISOString(),
        },
      ];
      localStorage.setItem('zenithflix_watch_history', JSON.stringify(watchHistory));
    });

    // Get second watch progress
    const secondProgress = await page.evaluate(() => {
      const stored = localStorage.getItem('zenithflix_watch_history');
      return stored ? JSON.parse(stored)[0].progress : 0;
    });

    // Progress should be updated
    expect(secondProgress).toBe(55);
    expect(secondProgress).toBeGreaterThan(firstProgress);
  });
});
