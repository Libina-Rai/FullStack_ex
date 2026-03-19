const { describe, test, beforeEach, expect } = require("@playwright/test");
const { login } = require("./helpers");

describe("When logged in", () => {
  beforeEach(async ({ page, request }) => {
    // reset database
    await request.post("http://localhost:3003/api/testing/reset");

    // create user
    const user = {
      name: "Priya Magar",
      username: "priya-mgr",
      password: "pri123456",
    };

    await request.post("http://localhost:3003/api/users", { data: user });

    // login using helper
    await login({
      page,
      username: "priya-mgr",
      password: "pri123456",
    });

    // confirm login
    await expect(page.getByText(/priya magar is logged in/i)).toBeVisible();
  });

  test("a new blog can be created", async ({ page }) => {
    const title = "My First Blog";
    const author = "Supriya Tamang";

    // open blog form
    await page.getByRole("button", { name: /create new( blog)?/i }).click();

    // fill in blog details
    await page.getByPlaceholder("title").fill(title);
    await page.getByPlaceholder("author").fill(author);
    await page.getByPlaceholder("url").fill("http://example.com");

    // submit form
    await page.getByRole("button", { name: "create" }).click();

    // wait for successful create feedback
    await expect(page.getByText(`a new blog ${title} added`)).toBeVisible();

    // verify created blog is visible in the list
    const blogItem = page.locator(".blog").filter({ hasText: `${title}${author}` }).last();
    await expect(blogItem).toBeVisible();
  });
});
