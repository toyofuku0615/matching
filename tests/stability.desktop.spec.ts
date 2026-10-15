import { expect, test, type Page } from "@playwright/test";

async function ready(page: Page, name: string) {
  await expect(page.locator(`.screen-${name}`)).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(`.screen-${name}`)
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
}

async function start(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "出会いをはじめる" }).click();
  await ready(page, "preferences");
  await page.getByRole("button", { name: /甘い人が好き/ }).click();
  await ready(page, "discover");
}

test("full journey uses only local resources after initial load", async ({
  page,
}) => {
  await page.goto("/");
  const externalRequests: string[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost")
      return route.continue();
    externalRequests.push(url.origin);
    return route.abort();
  });
  await page.getByRole("button", { name: "出会いをはじめる" }).click();
  await ready(page, "preferences");
  await page.getByRole("button", { name: /甘い人が好き/ }).click();
  await ready(page, "discover");
  await page.getByRole("button", { name: "次の写真" }).click();
  await page.getByRole("button", { name: "いい根！", exact: true }).click();
  await ready(page, "matched");
  await page.getByRole("button", { name: "メッセージを送る" }).click();
  await ready(page, "chat");
  for (const question of [
    /どうして農家になったんですか/,
    /本当に甘やかしてくれるんですか/,
  ]) {
    const button = page
      .locator(".quick-replies")
      .getByRole("button", { name: question });
    await button.click();
    await expect(button).toHaveCount(0);
  }
  await page.locator(".chat-product").click();
  await ready(page, "offer");
  await page.locator(".offer-bottom .primary").click();
  await ready(page, "completed");
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every((img) => img.complete && img.naturalWidth > 0),
        ),
    )
    .toBe(true);
  expect(externalRequests).toEqual([]);
});

test("going back during an in-flight swipe does not apply a stale match", async ({
  page,
}) => {
  await start(page);
  await page
    .getByRole("button", { name: "いい根！", exact: true })
    .evaluate((el) => (el as HTMLButtonElement).click());
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await ready(page, "preferences");
  // A stale swipe callback would replace preferences after its 340 ms animation.
  await page.waitForTimeout(450);
  await expect(page.locator(".screen-preferences")).toBeVisible();
  await page.getByRole("button", { name: /甘い人が好き/ }).click();
  await ready(page, "discover");
  await expect(
    page.getByRole("article", { name: "みほさんのプロフィール", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "体験メニュー" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "「いい根！」で、会話がはじまります。",
  );
});

test("reset cancels a pending reply and starts with a clean conversation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await start(page);
  await page.getByRole("button", { name: "いい根！", exact: true }).click();
  await ready(page, "matched");
  await page.getByRole("button", { name: "メッセージを送る" }).click();
  await ready(page, "chat");
  await page
    .locator(".quick-replies")
    .getByRole("button", { name: /どうして農家になったんですか/ })
    .click();
  await expect(page.locator(".typing")).toBeVisible();
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await ready(page, "discover");
  await page.getByRole("button", { name: "体験メニュー" }).click();
  await page.getByRole("button", { name: "最初からやり直す" }).click();
  await page.getByRole("button", { name: "最初からはじめる" }).click();
  await ready(page, "welcome");
  await page.waitForTimeout(950);
  await expect(page.locator(".screen-welcome")).toBeVisible();
  await page.getByRole("button", { name: "出会いをはじめる" }).click();
  await ready(page, "preferences");
  await page.getByRole("button", { name: /甘い人が好き/ }).click();
  await ready(page, "discover");
  await page.getByRole("button", { name: "いい根！", exact: true }).click();
  await ready(page, "matched");
  await page.getByRole("button", { name: "メッセージを送る" }).click();
  await ready(page, "chat");
  await expect(page.locator(".message-row")).toHaveCount(2);
  await expect(page.locator(".message-row.own")).toHaveCount(0);
  await expect(page.locator(".chat-product, .typing")).toHaveCount(0);
});

test("keyboard question selection keeps focus on the next available question", async ({
  page,
}) => {
  await start(page);
  await page.getByRole("button", { name: "いい根！", exact: true }).click();
  await ready(page, "matched");
  await page.getByRole("button", { name: "メッセージを送る" }).click();
  await expect(
    page.getByRole("log", { name: "みほさんとの会話" }),
  ).toBeVisible();
  const question = page
    .locator(".quick-replies")
    .getByRole("button", { name: /どうして農家になったんですか/ });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveCount(0);
  await expect(page.locator(".quick-replies button").first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator(".chat-product")).toHaveCount(1);
  await expect(page.locator(".quick-replies button").first()).toBeFocused();
});
