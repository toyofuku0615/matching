import { expect, test, type CDPSession, type Page } from "@playwright/test";

test.use({ hasTouch: true, isMobile: true });

async function swipe(page: Page, cdp: CDPSession, delta: number) {
  const box = await page.locator(".profile-card").boundingBox();
  if (!box) throw new Error("Profile card has no bounding box");
  const x = box.x + box.width / 2;
  const y = box.y + box.height * 0.35;
  const point = (offset: number) => [
    { x: x + offset, y, id: 1, radiusX: 8, radiusY: 8, force: 1 },
  ];
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: point(0),
  });
  for (let i = 1; i <= 12; i++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: point((delta * i) / 12),
    });
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(150);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
}

test("touch gestures spring back, pass left, and like right", async ({
  page,
  context,
}) => {
  await page.goto("/");
  expect(await page.evaluate(() => navigator.maxTouchPoints)).toBeGreaterThan(
    0,
  );
  await page.getByRole("button", { name: "出会いをはじめる" }).tap();
  await page.getByRole("button", { name: /甘い人が好き/ }).tap();
  await expect(
    page.getByRole("article", { name: "みほさんのプロフィール", exact: true }),
  ).toBeVisible();
  const original = await page.locator(".profile-card").boundingBox();
  const cdp = await context.newCDPSession(page);
  await swipe(page, cdp, 25);
  await expect(
    page.getByRole("article", { name: "みほさんのプロフィール", exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      Math.abs(
        (await page.locator(".profile-card").boundingBox())!.x - original!.x,
      ),
    )
    .toBeLessThan(1);
  await swipe(page, cdp, -145);
  await expect(
    page.getByRole("article", {
      name: "たくみさんのプロフィール",
      exact: true,
    }),
  ).toBeVisible();
  await swipe(page, cdp, 145);
  await expect(
    page.getByRole("heading", { name: "根が合いました！" }),
  ).toBeVisible();
  await expect(page.locator(".matched-description")).toContainText(
    "たくみさん",
  );
  await cdp.detach();
});
