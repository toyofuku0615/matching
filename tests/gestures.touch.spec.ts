import { expect, test, type CDPSession, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { assertHoretaneBrand } from "./assertions";

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
    brand: "みほの甘やかしいちご",
    variety: "とちあいか",
    method: "土耕栽培",
    practices: [
      "根っこが育つ土づくり",
      "葉っぱと実を毎朝確認",
      "色づきを見て朝採り",
    ],
    careQuestion: "いちごのこだわりは？",
    product: "とちあいか おすそ分け",
    productTitle: "朝採れ とちあいか お試しセット",
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
    tagline: "毎朝、顔色をうかがってます。",
    greeting: "プロフィールの一言、気になりましたか。",
    invitation: "あとは現物に任せます",
    brand: "たくみの一途トマト",
    variety: "桃太郎",
    method: "土耕栽培",
    practices: [
      "毎朝の観察で水加減を決める",
      "脇芽の手入れをこつこつ",
      "熟し具合を見て収穫",
    ],
    careQuestion: "誰の顔色をうかがっているんですか？",
    product: "桃太郎 おすそ分け",
    productTitle: "完熟 桃太郎トマト お試しセット",
    questions: [
      ["誰の顔色をうかがっているんですか？", "もちろん、トマトです。"],
      [
        "どうして農家になったんですか？",
        "トマトの研究には、定年がないようです。",
      ],
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
    tagline: "カモを30羽飼ってます。",
    greeting: "プロフィールのカモ、気になりましたか。",
    invitation: "米を少し、持っていきませんか。",
    brand: "まさおの合鴨田んぼ米",
    variety: "コシヒカリ",
    method: "合鴨農法",
    practices: [
      "合鴨が草や虫を食べる",
      "泳いで水をかき混ぜる",
      "穂が出る前に合鴨を移す",
    ],
    careQuestion: "なんでそんなにカモを飼っているんですか？",
    product: "コシヒカリ おすそ分け",
    productTitle: "合鴨育ち コシヒカリ お試しセット",
    questions: [
      [
        "なんでそんなにカモを飼っているんですか？",
        "うちの30羽は、米作りの相棒なんです。",
      ],
      [
        "どうして農家になったんですか？",
        "天気のほうは、こちらの経歴を見てくれません。",
      ],
      [
        "農家をしていて嬉しいことは？",
        "帰りの車は少し重くなります。米を積むので。",
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
    await assertHoretaneBrand(page);
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
    const cardAgriculture = card.locator(".farmer-agriculture");
    await expect(cardAgriculture).toContainText(farmer.variety);
    await expect(cardAgriculture).toContainText(farmer.method);
    await expect(cardAgriculture).toBeInViewport({ ratio: 1 });
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
    const farmingProfile = profile.locator(".agriculture-info");
    if (farmer.id === "masao") {
      await expect(profile.locator(".detail-body > p").first()).toContainText(
        "30羽の合鴨",
      );
      await expect(
        farmingProfile.locator(".agriculture-summary"),
      ).toContainText("30羽の合鴨");
      await expect(
        farmingProfile.locator(".agriculture-practices"),
      ).toContainText("30羽の合鴨");
      expect(new Set((await profile.innerText()).match(/\d+羽/g))).toEqual(
        new Set(["30羽"]),
      );
    }
    await expect(farmingProfile.locator(".agriculture-brand")).toHaveText(
      farmer.brand,
    );
    await expect(farmingProfile.locator(".agriculture-facts")).toContainText(
      farmer.variety,
    );
    await expect(farmingProfile.locator(".agriculture-facts")).toContainText(
      farmer.method,
    );
    for (const practice of farmer.practices) {
      const practiceTitle = farmingProfile
        .locator(".agriculture-practices")
        .getByText(practice, { exact: true });
      await practiceTitle.scrollIntoViewIfNeeded();
      await expect(practiceTitle).toBeInViewport({ ratio: 1 });
    }
    await farmingProfile.locator(".agriculture-brand").scrollIntoViewIfNeeded();
    await expect(farmingProfile.locator(".agriculture-brand")).toBeInViewport();
    await page.screenshot({
      path: `${directory}/10-${farmer.id}-growing-profile.png`,
      animations: "disabled",
    });
    await expect(page.getByRole("button", { name: "閉じる" })).toBeInViewport({
      ratio: 1,
    });
    await page.getByRole("button", { name: "閉じる" }).tap();
    await expect(profile).toHaveCount(0);
    await page.getByRole("button", { name: "いい根！", exact: true }).tap();
    await page.getByRole("button", { name: "メッセージを送る" }).tap();
    const conversation = page.getByRole("log", {
      name: `${farmer.name}さんとの会話`,
    });
    await expect(conversation).toContainText(farmer.greeting);
    await expect(page.locator(".quick-replies button")).toHaveCount(4);
    if (farmer.id !== "miho") {
      await expect(page.locator(".quick-replies button").first()).toContainText(
        farmer.careQuestion,
      );
      await expect(conversation).not.toContainText(
        farmer.id === "takumi" ? "トマト" : "合鴨",
      );
      await expect(conversation).not.toContainText(
        farmer.id === "takumi" ? "葉や実の色" : "米作りの相棒",
      );
    }
    const tryFreeMessage = async () => {
      await page
        .getByRole("textbox", { name: "メッセージ", exact: true })
        .fill("畑の様子を教えてください");
      await page.getByRole("button", { name: "メッセージを送信" }).tap();
      await expect(conversation).toContainText("決まった台本で話す体験版");
    };
    if (farmer.id === "miho") await tryFreeMessage();
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
      if (question === farmer.careQuestion) {
        const careAnswer = conversation
          .locator(".message-row:not(.own) .bubble")
          .filter({ hasText: farmer.brand });
        await expect(careAnswer).toContainText(farmer.variety);
        await expect(careAnswer).toContainText(farmer.method);
        if (farmer.id === "takumi") {
          await expect(
            conversation.locator(".message-row:not(.own) .bubble").nth(2),
          ).toHaveText(/^もちろん、トマトです。/);
          await expect(conversation).toContainText(
            "土が湿っていれば水を控えるし",
          );
          await expect(conversation).toContainText("毎日ノートに残しています");
        }
        if (farmer.id === "masao") {
          await expect(conversation).toContainText("草や虫を食べ");
          await expect(conversation).toContainText("水をかき混ぜ");
          await expect(conversation).toContainText("私は水の深さと稲の育ち");
          await expect(conversation).toContainText(
            "穂が出る前には田んぼから上げる",
          );
          await expect(conversation).toContainText(
            "台所では炊飯器に頑張ってもらいます。分担です。",
          );
          expect(
            new Set((await conversation.innerText()).match(/\d+羽/g)),
          ).toEqual(new Set(["30羽"]));
        }
        if (farmer.id !== "miho") {
          await expect
            .poll(() =>
              careAnswer.evaluate((el) =>
                Number(getComputedStyle(el.closest(".message-row")!).opacity),
              ),
            )
            .toBe(1);
          await conversation
            .locator(".message-row.own .bubble")
            .filter({ hasText: question })
            .evaluate((el) =>
              el.scrollIntoView({ block: "start", behavior: "instant" }),
            );
          await page.screenshot({
            path: `${directory}/12-${farmer.id}-story-chat.png`,
            animations: "disabled",
          });
        }
      }
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
    if (farmer.id !== "miho") await tryFreeMessage();
    await expect(page.locator(".chat-product")).toHaveCount(1);
    await expect(
      conversation.locator(".bubble").filter({ hasText: farmer.invitation }),
    ).toHaveCount(1);
    await expect(page.locator(".chat-product")).toContainText(farmer.product);
    await expect(page.locator(".chat-product-agriculture")).toContainText(
      farmer.variety,
    );
    await expect(page.locator(".chat-product-agriculture")).toContainText(
      farmer.method,
    );
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
    await page.locator(".chat-product").tap();
    await expect(page.locator(".screen-offer")).toBeVisible();
    await expect(page.locator(".product-brand")).toHaveText(farmer.brand);
    await expect(page.locator(".offer-information h2")).toHaveText(
      farmer.productTitle,
    );
    const offerAgriculture = page.locator(
      ".offer-information .agriculture-info",
    );
    await expect(offerAgriculture.locator(".agriculture-facts")).toContainText(
      farmer.variety,
    );
    await expect(offerAgriculture.locator(".agriculture-facts")).toContainText(
      farmer.method,
    );
    if (farmer.id === "masao") {
      await expect(
        offerAgriculture.locator(".agriculture-summary"),
      ).toContainText("30羽の合鴨");
      await expect(page.locator(".letter-card p")).toContainText("30羽の合鴨");
    }
    if (farmer.id === "takumi") {
      await expect(page.locator(".letter-card p")).toContainText(
        "食べたあなたの顔が気になります",
      );
    }
    await offerAgriculture.scrollIntoViewIfNeeded();
    await expect(offerAgriculture).toBeInViewport();
    await expect(page.locator(".offer-bottom .primary")).toBeInViewport({
      ratio: 1,
    });
    await assertHoretaneBrand(page);
    await expect
      .poll(() =>
        page
          .locator(".screen-offer")
          .evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBe(1);
    await page.screenshot({
      path: `${directory}/11-${farmer.id}-agriculture-offer.png`,
      animations: "disabled",
    });
    await page.locator(".offer-bottom .primary").tap();
    await expect(page.locator(".screen-completed")).toBeVisible();
    await expect(
      page.getByText(`${farmer.name}さんと、つながりました。`),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "もう一度、出会う" }),
    ).toBeInViewport({ ratio: 1 });
    await expect
      .poll(() =>
        page
          .locator(".screen-completed")
          .evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBe(1);
    await expect
      .poll(() =>
        page
          .locator(".completion-art img")
          .evaluateAll((images) =>
            images.every((img) => img.complete && img.naturalWidth > 0),
          ),
      )
      .toBe(true);
    await assertHoretaneBrand(page);
    await page.screenshot({
      path: `${directory}/13-${farmer.id}-story-completed.png`,
      animations: "disabled",
    });
    await page.getByRole("button", { name: "もう一度、出会う" }).tap();
    await expect(
      page.getByRole("button", { name: "出会いをはじめる" }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
