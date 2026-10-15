import { expect, type Page } from "@playwright/test";

export async function assertHoretaneBrand(page: Page) {
  await expect(page).toHaveTitle(/^ほれたね/);
  for (const brand of await page.locator(".brand").all()) {
    await expect(brand).toBeVisible();
    await expect(brand).toContainText("ほれたね");
    await expect(brand).toHaveAttribute("aria-label", /ほれたね/);
  }
  await expect(page.locator(".desktop-canvas")).not.toContainText(
    /農miai|のうみあい|NOU MIAI/,
  );
  await expect(
    page.locator('[aria-label*="農miai"], [title*="農miai"], [alt*="農miai"]'),
  ).toHaveCount(0);
}
