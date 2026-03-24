async function login({ page, username, password }) {
  await page.goto('http://localhost:5173');

  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

async function createBlog({ page, title, author, url }) {
  // open form
  await page.getByRole('button', { name: /create new( blog)?/i }).click();

  // fill form
  await page.getByPlaceholder('title').fill(title);
  await page.getByPlaceholder('author').fill(author);
  await page.getByPlaceholder('url').fill(url);

  // submit
  await page.getByRole('button', { name: 'create' }).click();
}

module.exports = { login, createBlog };