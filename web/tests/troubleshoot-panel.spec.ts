import { test, expect } from "@playwright/test";

test.describe("TroubleshootPanel", () => {
  test("renders three buttons and gates verify/cleanup when not provisioned", async ({
    page,
  }) => {
    await page.route("**/api/labs/101/state", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          labId: "101",
          phase: "NOT_PROVISIONED",
          tag: "AutoLabId=101",
          startedAt: null,
          lastVerifiedAt: null,
          lastError: null,
        }),
      });
    });
    await page.goto("/labs/101");
    await expect(
      page.getByText("Troubleshooting Lab Controls"),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Start" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Verify" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Cleanup" })).toBeDisabled();
  });

  test("enables verify and cleanup when phase is READY", async ({ page }) => {
    await page.route("**/api/labs/101/state", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          labId: "101",
          phase: "READY",
          tag: "AutoLabId=101",
          startedAt: "2026-05-13T10:00:00Z",
          lastVerifiedAt: null,
          lastError: null,
        }),
      });
    });
    await page.goto("/labs/101");
    await expect(page.getByRole("button", { name: "Start" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Verify" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "Cleanup" })).toBeEnabled();
  });
});
