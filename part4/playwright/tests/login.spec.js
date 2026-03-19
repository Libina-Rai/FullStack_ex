const { describe, test, beforeEach, expect } = require('@playwright/test');

describe('Login', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset') // reset the database before each test

    //create a test user
    const user = {
      name: 'Priya Magar',
      username: 'priya-mgr',
      password: 'pri123456'
    }
    await request.post('http://localhost:3003/api/users', { data: user }) 

    //visit the application
    await page.goto('http://localhost:5173'); 
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })
  
  test('succesful login with correct credentials', async ({ page }) => {
    await page.fill('input[name="username"]', 'priya-mgr')
    await page.fill('input[name="password"]', 'pri123456')
    await page.click('button[type="submit"]')

    await expect(page.getByText('priya Magar is logged in')).toBeVisible()
  })

  test('failed with wrong credentials', async({ page }) => {
    await page.fill('input[name="username"]', 'priya-mgr')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.getByText('wrong username or password')).toBeVisible()
  })
})
