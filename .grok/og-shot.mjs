import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const jobs = [
  { html: resolve("/workspace/.grok/og-card.html"), out: resolve("/workspace/.grok/og-raw.png"), w: 1200, h: 630 },
  { html: resolve("/workspace/.grok/og-banner.html"), out: resolve("/workspace/.grok/x-banner-raw.png"), w: 1200, h: 264 },
];

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  for (const job of jobs) {
    const page = await browser.newPage({
      viewport: { width: job.w, height: job.h },
      deviceScaleFactor: 2,
    });
    await page.goto(pathToFileURL(job.html).href, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: job.out, type: "png" });
    await page.close();
    console.log("shot", job.out);
  }
} finally {
  await browser.close();
}
