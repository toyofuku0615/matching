import { expect, test, type CDPSession, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

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

const experiencedFarmers = [
  {
    id: "miho",
    name: "みほ",
    age: "68",
    skips: 0,
    tagline: "甘やかすのが得意です。",
    greeting: "まずお茶にしましょう。",
    invitation: "私の『少し』にしては控えめよ",
    product: "完熟いちご お試しセット",
    questions: [
      [
        "本当に甘やかしてくれるんですか？笑",
        "帰りに持たせる野菜は、断っても増えます。",
      ],
      ["どうして農家になったんですか？", "来年こそは少し楽に"],
      ["いちごのこだわりは？", "いちごには厳しく、人にはおかわり。"],
      [
        "農薬は使っていますか？",
        "『こらっ』で虫が帰ってくれたら、私も楽なんだけどね。",
      ],
    ],
  },
  {
    id: "takumi",
    name: "たくみ",
    age: "72",
    skips: 1,
    tagline: "トマト一筋、浮気しません。",
    greeting: "今日もトマトに異常なし。",
    invitation: "あとは現物に任せます",
    product: "完熟トマト お試しセット",
    questions: [
      [
        "どうして農家になったんですか？",
        "トマトの研究には、定年がないようです。",
      ],
      ["トマトのこだわりは？", "予定はトマト優先です。"],
      ["愛犬はどんな子ですか？", "残業はしない方針らしい。見習いたいですね。"],
      [
        "おすすめの食べ方、教えてください！",
        "育てるのに50年かけたので、調理は手短に済ませています。",
      ],
    ],
  },
  {
    id: "masao",
    name: "まさお",
    age: "76",
    skips: 2,
    tagline: "米とは55年の真剣交際。",
    greeting: "田んぼの水を見てきたところです。",
    invitation: "米を少し、持っていきませんか。",
    product: "新潟のお米 お試しセット",
    questions: [
      [
        "どうして農家になったんですか？",
        "天気のほうは、こちらの経歴を見てくれません。",
      ],
      [
        "農家をしていて嬉しいことは？",
        "帰りの車は少し重くなります。米を積むので。",
      ],
      [
        "美味しいごはんを炊くコツは？",
        "台所では炊飯器に頑張ってもらいます。分担です。",
      ],
      [
        "お休みの日は何をしていますか？",
        "結局どっちにしても、水辺にいますね。",
      ],
    ],
  },
];

for (const farmer of experiencedFarmers) {
  test(`elderly farmer ${farmer.name}: visible age and agricultural humor in all four answers`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const directory = resolve(
      process.env.NOUMIAI_ARTIFACTS_DIR || "test-results/screenshots",
      info.project.name,
    );
    await mkdir(directory, { recursive: true });
    await page.goto("/");
    await page.getByRole("button", { name: "出会いをはじめる" }).tap();
    await page.getByRole("button", { name: /甘い人が好き/ }).tap();
    await expect(page.locator(".screen-discover")).toBeVisible();
    for (let i = 0; i < farmer.skips; i++) {
      await page.getByRole("button", { name: "ごめん根", exact: true }).tap();
      await expect(page.locator(".discover-count")).toContainText(
        String(i + 2),
      );
    }
    const card = page.getByRole("article", {
      name: `${farmer.name}さんのプロフィール`,
      exact: true,
    });
    await expect(card).toBeVisible();
    await expect(card.locator(".name-line h2 span")).toHaveText(farmer.age);
    await expect(card.locator(".tagline")).toHaveText(farmer.tagline);
    await expect
      .poll(() =>
        card
          .locator(".farmer-photo")
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await expect
      .poll(() =>
        page
          .locator(".screen-discover")
          .evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBe(1);
    await page.screenshot({
      path: `${directory}/09-${farmer.id}-profile.png`,
      animations: "disabled",
    });
    await page
      .getByRole("button", {
        name: `${farmer.name}さんのプロフィールをもっと見る`,
      })
      .tap();
    const profile = page.getByRole("dialog", {
      name: `${farmer.name}さんのプロフィール詳細`,
    });
    await expect(profile.locator(".detail-name h2 span")).toHaveText(
      farmer.age,
    );
    await expect
      .poll(() =>
        profile
          .locator("img")
          .evaluateAll((images) =>
            images.every((img) => img.complete && img.naturalWidth > 0),
          ),
      )
      .toBe(true);
    await page.getByRole("button", { name: "閉じる" }).tap();
    await expect(profile).toHaveCount(0);
    await page.getByRole("button", { name: "いい根！", exact: true }).tap();
    await page.getByRole("button", { name: "メッセージを送る" }).tap();
    const conversation = page.getByRole("log", {
      name: `${farmer.name}さんとの会話`,
    });
    await expect(conversation).toContainText(farmer.greeting);
    await expect(page.locator(".quick-replies button")).toHaveCount(4);
    await page
      .getByRole("textbox", { name: "メッセージ", exact: true })
      .fill("畑の様子を教えてください");
    await page.getByRole("button", { name: "メッセージを送信" }).tap();
    await expect(conversation).toContainText("決まった台本で話す体験版");
    await expect(page.locator(".chat-product")).toHaveCount(0);
    for (const [index, [question, punchline]] of farmer.questions.entries()) {
      const quickReply = page
        .locator(".quick-replies")
        .getByRole("button", { name: question });
      await quickReply.tap();
      await expect(page.locator(".typing")).toBeVisible();
      await expect(page.locator(".quick-replies button:enabled")).toHaveCount(
        0,
      );
      await expect(quickReply).toHaveCount(0);
      await expect(
        conversation.locator(".bubble").filter({ hasText: punchline }),
      ).toHaveCount(1);
      await expect(
        conversation
          .locator(".message-row.own .bubble")
          .filter({ hasText: question }),
      ).toHaveCount(1);
      await expect(page.locator(".quick-replies button")).toHaveCount(
        3 - index,
      );
      await expect(page.locator(".chat-product")).toHaveCount(
        index === 0 ? 0 : 1,
      );
      if (farmer.id === "miho" && index === 0) {
        await expect
          .poll(() =>
            conversation
              .locator(".message-row")
              .last()
              .evaluate((el) => Number(getComputedStyle(el).opacity)),
          )
          .toBe(1);
        await page.screenshot({
          path: `${directory}/08-miho-farmer-humor.png`,
          animations: "disabled",
        });
      }
    }
    await expect(
      conversation.locator(".bubble").filter({ hasText: farmer.invitation }),
    ).toHaveCount(1);
    await expect(page.locator(".chat-product")).toContainText(farmer.product);
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
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `${directory}/08-${farmer.id}-dialogue.png`,
      animations: "disabled",
    });
    expect(errors).toEqual([]);
  });
}
