import {
  expect,
  test,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const screen = (page: Page, name: string) => page.locator(`.screen-${name}`);
const product = (page: Page) => page.locator(".chat-product");

async function ready(page: Page, name: string) {
  await expect(screen(page, name)).toBeVisible();
  await expect
    .poll(() =>
      screen(page, name).evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBe(1);
}

async function inViewport(locator: Locator) {
  await expect(locator).toBeVisible();
  await expect(locator).toBeInViewport({ ratio: 1 });
}

async function checkLayout(page: Page) {
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images.every((img) => img.complete && img.naturalWidth > 0),
        ),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".app-shell")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
}

async function capture(
  page: Page,
  info: TestInfo,
  name: string,
  critical: Locator[],
) {
  await checkLayout(page);
  for (const control of critical) await inViewport(control);
  // Wait for the delayed spring to settle before capturing the match/completion art.
  const spring = page.locator(".match-heart, .completion-sprout");
  if (await spring.count())
    await expect
      .poll(() =>
        spring.evaluate((el) => {
          const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
          return Math.abs(matrix.a - 1) + Math.abs(matrix.b);
        }),
      )
      .toBeLessThan(0.01);
  const directory = resolve(
    process.env.NOUMIAI_ARTIFACTS_DIR || "test-results/screenshots",
    info.project.name,
  );
  await mkdir(directory, { recursive: true });
  await page.screenshot({
    path: `${directory}/${name}.png`,
    animations: "disabled",
  });
}

async function discover(page: Page, preference = "甘い人が好き") {
  await page.goto("/");
  await page
    .getByRole("button", { name: "出会いをはじめる", exact: true })
    .click();
  await ready(page, "preferences");
  await page.getByRole("button", { name: new RegExp(preference) }).click();
  await ready(page, "discover");
}

async function enterChat(page: Page, name = "みほ") {
  await expect(
    page.getByRole("article", {
      name: `${name}さんのプロフィール`,
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "いい根！", exact: true }).click();
  await ready(page, "matched");
  await page
    .getByRole("button", { name: "メッセージを送る", exact: true })
    .click();
  await ready(page, "chat");
  await expect(
    page.getByRole("log", { name: `${name}さんとの会話` }),
  ).toBeVisible();
}

async function ask(page: Page, question: string) {
  const quickReply = page
    .locator(".quick-replies")
    .getByRole("button", {
      name: new RegExp(question.replace(/[?？]/g, "[?？]")),
    });
  await quickReply.click();
  await expect(quickReply).toHaveCount(0);
  await expect(page.locator(".typing")).toHaveCount(0);
}

async function drag(page: Page, delta: number, slow = false) {
  const box = await page.locator(".profile-card").boundingBox();
  if (!box) throw new Error("Profile card has no bounding box");
  const x = box.x + box.width / 2;
  const y = box.y + box.height * 0.35;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(x + (delta * i) / 12, y, { steps: 1 });
    if (slow) await page.waitForTimeout(40);
  }
  if (slow) await page.waitForTimeout(150);
  await page.mouse.up();
}

test("all seven screens: Miho, gallery, profile, fallback, two questions, offer, back, completion and restart", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await ready(page, "welcome");
  await capture(page, info, "01-welcome", [
    page.getByRole("button", { name: "出会いをはじめる" }),
  ]);
  await page.getByRole("button", { name: "出会いをはじめる" }).click();
  await ready(page, "preferences");
  await capture(page, info, "02-preferences", [
    page.getByRole("button", { name: /甘い人が好き/ }),
    page.getByRole("button", { name: /ちょっと刺激がほしい/ }),
  ]);
  await page.getByRole("button", { name: /甘い人が好き/ }).click();
  await ready(page, "discover");
  await capture(page, info, "03-discover", [
    page.getByRole("button", { name: "いい根！", exact: true }),
    page.getByRole("button", { name: "ごめん根", exact: true }),
    page.getByRole("button", { name: "次の写真" }),
  ]);
  const firstPhoto = await page.locator(".farmer-photo").getAttribute("src");
  await page.getByRole("button", { name: "次の写真" }).click();
  await expect(page.getByLabel("写真 2 / 3", { exact: true })).toBeVisible();
  await expect(page.locator(".farmer-photo")).not.toHaveAttribute(
    "src",
    firstPhoto!,
  );
  await page.getByRole("button", { name: "次の写真" }).click();
  await expect(page.getByLabel("写真 3 / 3", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "次の写真" }).click();
  await expect(page.locator(".farmer-photo")).toHaveAttribute(
    "src",
    firstPhoto!,
  );
  await page.getByRole("button", { name: "前の写真" }).click();
  await expect(page.getByLabel("写真 3 / 3", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "みほさんのプロフィールをもっと見る" })
    .click();
  const profile = page.getByRole("dialog", {
    name: "みほさんのプロフィール詳細",
  });
  await expect(profile).toBeVisible();
  for (const heading of [
    "好きなこと",
    "こんな性格です",
    "農家になったきっかけ",
    "ここだけの話",
    "育てているもの",
    "農家の日常",
  ])
    await expect(
      profile.getByRole("heading", { name: heading }),
    ).toBeAttached();
  await expect(page.getByRole("button", { name: "閉じる" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "閉じる" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(profile).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "みほさんのプロフィールをもっと見る" }),
  ).toBeFocused();
  await page.getByRole("button", { name: /どんな人/ }).click();
  await expect(profile).toBeVisible();
  await page.getByRole("button", { name: "閉じる" }).click();
  await expect(profile).toHaveCount(0);
  await page.getByRole("button", { name: "いい根！", exact: true }).click();
  await ready(page, "matched");
  await capture(page, info, "04-matched", [
    page.getByRole("button", { name: "メッセージを送る" }),
    page.getByRole("button", { name: "ほかの出会いも見てみる" }),
  ]);
  await page.getByRole("button", { name: "メッセージを送る" }).click();
  await ready(page, "chat");
  await capture(page, info, "05-chat", [
    page.getByRole("textbox", { name: "メッセージ", exact: true }),
    page.getByRole("button", { name: "メッセージを送信" }),
    page.locator(".quick-replies button").last(),
  ]);
  await expect(
    page.getByRole("button", { name: "メッセージを送信" }),
  ).toBeDisabled();
  await page
    .getByRole("textbox", { name: "メッセージ", exact: true })
    .fill("こんにちは、畑はどんな香りですか？");
  await page.getByRole("button", { name: "メッセージを送信" }).click();
  await expect(page.locator(".conversation")).toContainText(
    "これは台本で会話を楽しむ体験版なので",
  );
  await expect(
    page.getByRole("textbox", { name: "メッセージ", exact: true }),
  ).toHaveValue("");
  await expect(product(page)).toHaveCount(0);
  await ask(page, "どうして農家になったんですか？");
  await expect(page.locator(".conversation")).toContainText(
    "もともと東京で会社員をしてたんです",
  );
  await expect(product(page)).toHaveCount(0);
  await ask(page, "本当に甘やかしてくれるんですか？笑");
  await expect(product(page)).toHaveCount(1);
  await expect(product(page)).toContainText("みほさんからのおすそ分け");
  await ask(page, "いちごのこだわりは？");
  await expect(product(page)).toHaveCount(1);
  await expect(
    page
      .locator(".bubble")
      .filter({ hasText: "そうだ、よかったらうちのいちご" }),
  ).toHaveCount(1);
  await product(page).click();
  await ready(page, "offer");
  await capture(page, info, "06-offer", [
    page.locator(".offer-bottom .primary"),
    page.getByRole("button", { name: "戻る", exact: true }),
  ]);
  await expect(page.locator(".offer-information")).toContainText("いちご");
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await ready(page, "chat");
  await expect(product(page)).toHaveCount(1);
  await product(page).click();
  await ready(page, "offer");
  await page.locator(".offer-bottom .primary").click();
  await ready(page, "completed");
  await capture(page, info, "07-completed", [
    page.getByRole("button", { name: "もう一度、出会う" }),
  ]);
  await expect(page.getByText("みほさんと、つながりました。")).toBeVisible();
  await page.getByRole("button", { name: "もう一度、出会う" }).click();
  await ready(page, "welcome");
  await page.getByRole("button", { name: "出会いをはじめる" }).click();
  await ready(page, "preferences");
  await page.getByRole("button", { name: /甘い人が好き/ }).click();
  await ready(page, "discover");
  await enterChat(page);
  await expect(product(page)).toHaveCount(0);
  await expect(page.locator(".message-row.own")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("skipping all farmers has a useful recovery", async ({ page }) => {
  await discover(page);
  for (const name of ["みほ", "たくみ", "まさお"]) {
    await expect(
      page.getByRole("article", {
        name: `${name}さんのプロフィール`,
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: "ごめん根", exact: true }).click();
  }
  await expect(
    page.getByRole("heading", { name: "もう一度、気になる人を。" }),
  ).toBeVisible();
  await inViewport(page.getByRole("button", { name: "もう一度見てみる" }));
  await page.getByRole("button", { name: "もう一度見てみる" }).click();
  await expect(
    page.getByRole("article", { name: "みほさんのプロフィール", exact: true }),
  ).toBeVisible();
  await checkLayout(page);
});

for (const farmer of [
  { name: "たくみ", skips: 1, second: "トマトのこだわりは？", crop: "トマト" },
  {
    name: "まさお",
    skips: 2,
    second: "農家をしていて嬉しいことは？",
    crop: "お米",
  },
]) {
  test(`skipping selects ${farmer.name} with their own conversation and product`, async ({
    page,
  }) => {
    await discover(page);
    for (let i = 0; i < farmer.skips; i++) {
      await page.getByRole("button", { name: "ごめん根", exact: true }).click();
      await expect(page.locator(".discover-count")).toContainText(
        String(i + 2),
      );
    }
    await enterChat(page, farmer.name);
    await ask(page, "どうして農家になったんですか？");
    await expect(product(page)).toHaveCount(0);
    await ask(page, farmer.second);
    await expect(product(page)).toHaveCount(1);
    await expect(product(page)).toContainText(
      `${farmer.name}さんからのおすそ分け`,
    );
    await expect(product(page)).toContainText(farmer.crop);
    await checkLayout(page);
  });
}

test("real mouse drags spring back, skip left and match right", async ({
  page,
}) => {
  await discover(page);
  const initial = await page.locator(".profile-card").boundingBox();
  await drag(page, 25, true);
  await expect(
    page.getByRole("article", { name: "みほさんのプロフィール", exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      Math.abs(
        (await page.locator(".profile-card").boundingBox())!.x - initial!.x,
      ),
    )
    .toBeLessThan(1);
  await drag(page, -155);
  await expect(
    page.getByRole("article", {
      name: "たくみさんのプロフィール",
      exact: true,
    }),
  ).toBeVisible();
  await drag(page, 155);
  await ready(page, "matched");
  await expect(page.locator(".matched-description")).toContainText(
    "たくみさん",
  );
  await page.getByRole("button", { name: "メッセージを送る" }).click();
  await ready(page, "chat");
  await expect(
    page.getByRole("log", { name: "たくみさんとの会話" }),
  ).toBeVisible();
});

test("rapid decisions and question clicks do not duplicate state; menu reset works", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "出会いをはじめる" }).click();
  await ready(page, "preferences");
  await page.getByRole("button", { name: /甘い人が好き/ }).evaluate((el) => {
    for (let i = 0; i < 8; i++) (el as HTMLButtonElement).click();
  });
  await ready(page, "discover");
  await page
    .getByRole("button", { name: "ごめん根", exact: true })
    .evaluate((el) => {
      for (let i = 0; i < 8; i++) (el as HTMLButtonElement).click();
    });
  await expect(
    page.getByRole("article", {
      name: "たくみさんのプロフィール",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".discover-count")).toContainText("2");
  await page
    .getByRole("button", { name: "いい根！", exact: true })
    .evaluate((el) => {
      for (let i = 0; i < 8; i++) (el as HTMLButtonElement).click();
    });
  await ready(page, "matched");
  await page.getByRole("button", { name: "メッセージを送る" }).click();
  await ready(page, "chat");
  const question = "どうして農家になったんですか？";
  await page
    .locator(".quick-replies")
    .getByRole("button", { name: new RegExp(question) })
    .evaluate((el) => {
      for (let i = 0; i < 8; i++) (el as HTMLButtonElement).click();
    });
  await expect(
    page
      .locator(".quick-replies")
      .getByRole("button", { name: new RegExp(question) }),
  ).toHaveCount(0);
  await expect(
    page.locator(".message-row.own .bubble").filter({ hasText: question }),
  ).toHaveCount(1);
  await expect(product(page)).toHaveCount(0);
  await page.getByRole("button", { name: "戻る", exact: true }).click();
  await ready(page, "discover");
  await page.getByRole("button", { name: "体験メニュー" }).click();
  await page.getByRole("button", { name: "最初からやり直す" }).click();
  await expect(
    page.getByRole("dialog", { name: "もう一度、はじめますか？" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "このまま続ける" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "体験メニュー" }).click();
  await page.getByRole("button", { name: "最初からやり直す" }).click();
  await page.getByRole("button", { name: "最初からはじめる" }).click();
  await ready(page, "welcome");
});
