const { describe, test, beforeEach, expect } = require("@playwright/test");
const { login, createBlog } = require("./helpers");

describe("When logged in", () => {
  beforeEach(async ({ page, request }) => {
    // reset database
    await request.post("http://localhost:3003/api/testing/reset");

    // create first user
    const user = {
      name: "Priya Magar",
      username: "priya-mgr",
      password: "pri123456",
    };
    await request.post("http://localhost:3003/api/users", { data: user });

    // login as first user
    await login({
      page,
      username: "priya-mgr",
      password: "pri123456",
    });

    // confirm login
    await expect(page.getByText(/priya magar is logged in/i)).toBeVisible();
  });

  test("a new blog can be created", async ({ page }) => {
    const title = `My First Blog ${Date.now()}`;
    const author = "Supriya Tamang";

    await createBlog({ page, title, author, url: "http://example.com" });

    const blogItem = page.locator(".blog", { hasText: title });
    await expect(blogItem).toBeVisible();
    await expect(page.getByText(`a new blog ${title} added`)).toBeVisible();
  });

  //test for liking a blog
  test("a blog can be liked", async ({ page }) => {
    const title = `Like Test Blog ${Date.now()}`;
    await createBlog({ page, title, author: "Supriya Tamang", url: "http://example.com" });

    const blogItem = page.locator(".blog", { hasText: title });
    await expect(blogItem).toBeVisible();

    await blogItem.getByRole("button", { name: "view" }).click();
    await expect(blogItem.getByText(/likes 0/i)).toBeVisible();

    await blogItem.getByRole("button", { name: "like" }).click();
    await expect(blogItem.getByText(/likes 1/i)).toBeVisible();
  });

  //test for deleting a blog
  test("a blog can be deleted by its creator", async ({ page }) => {
    const title = `Delete Test Blog ${Date.now()}`;

    await createBlog({ page, title, author: "Supriya Tamang", url: "http://example.com" });

    const blogItem = page.locator(".blog", { hasText: title });
    await expect(blogItem).toBeVisible();

    await blogItem.getByRole("button", { name: "view" }).click();

    // handle confirm dialog only once
    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await blogItem.getByRole("button", { name: "remove" }).click();

    await expect(page.locator(".blog", { hasText: title })).toHaveCount(0);
  });

  //test for delete button visibility only for the creator
  test("only the creator sees the delete button", async ({ page, request }) => {
    const title = `Permission Test Blog ${Date.now()}`;

    // create second user
    await request.post("http://localhost:3003/api/users", {
      data: { name: "Second User", username: "second-user", password: "password123" },
    });

    // create blog as first user
    await createBlog({ page, title, author: "Creator", url: "http://example.com" });

    // logout first user
    await page.getByRole("button", { name: /logout/i }).click();

    // login as second user
    await login({ page, username: "second-user", password: "password123" });

    const blogItem = page.locator(".blog", { hasText: title });
    await expect(blogItem).toBeVisible();

    await blogItem.getByRole("button", { name: "view" }).click();

    // remove button should NOT exist for second user
    await expect(blogItem.getByRole("button", { name: "remove" })).toHaveCount(0);
  });
});
