async function login({ page, username, password }) {
  await page.goto('http://localhost:5173');

  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

module.exports = { login };