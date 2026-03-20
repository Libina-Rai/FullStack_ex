const { describe, test, beforeEach, expect } = require("@playwright/test");
const { login, createBlog } = require("./helpers");

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
    const title = `My First Blog ${Date.now()}`;
    const author = "Supriya Tamang";

    await createBlog({
      page,
      title,
      author,
      url: "http://example.com",
    });

    // check success notification
    await expect(page.getByText(`a new blog ${title} added`)).toBeVisible();

    // verify blog appears in list
    const blogItem = page.locator(".blog", { hasText: title });
    await expect(blogItem).toBeVisible();
  });
  
  //test for liking a blog
  test("a blog can be liked", async ({ page }) => {
    const title = `Like Test Blog ${Date.now()}`;

    await createBlog({
      page,
      title,
      author: "Supriya Tamang",
      url: "http://example.com",
    });

    const blogItem = page.locator(".blog", { hasText: title });
    await expect(blogItem).toBeVisible();

    // open blog details
    await blogItem.getByRole("button", { name: "view" }).click();

    // initial likes
    await expect(blogItem.getByText(/likes 0/i)).toBeVisible();

    // click like
    await blogItem.getByRole("button", { name: "like" }).click();

    // verify likes increased
    await expect(blogItem.getByText(/likes 1/i)).toBeVisible();
  });

  //test for deleting a blog
  test("a blog can be deleted by its creator", async ({ page }) => {
  const title = `Delete Test Blog ${Date.now()}`;

  await createBlog({
    page,
    title,
    author: "Supriya Tamang",
    url: "http://example.com",
  });

  const blogItem = page.locator(".blog", { hasText: title });
  await expect(blogItem).toBeVisible();

  // open details
  await blogItem.getByRole("button", { name: "view" }).click();

  // handle confirm dialog
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  // click remove
  await blogItem.getByRole("button", { name: "remove" }).click();

  // verify removal
  await expect(page.locator(".blog", { hasText: title })).toHaveCount(0);
});
});
