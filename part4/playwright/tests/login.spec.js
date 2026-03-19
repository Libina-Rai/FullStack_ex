const { describe, test, beforeEach, expect } = require('@playwright/test');

describe('Login', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173'); 
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })
})
