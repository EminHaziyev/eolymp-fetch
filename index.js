const axios = require("axios");
const puppeteer = require("puppeteer");
const express = require("express");

const app = express();
let browser;
let cache = { count: null, lastUpdated: 0 };

(async () => {
    browser = await puppeteer.launch({ headless: "new" });
    updateCache();
    setInterval(updateCache, 15 * 60 * 1000);
})();

async function updateCache() {
    try {
        if (!browser) return;

        const url = "https://basecamp.eolymp.com/en/users/eminhazi";
        const selector = ".ui-mwp49i";

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(15000);
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(selector, { timeout: 10000 });

        const stats = await page.$eval(selector, el => el.textContent.trim());
        await page.close();

        cache = { count: stats, lastUpdated: Date.now() };
        console.log("Cache updated:", cache);
    } catch (error) {
        console.error("Error updating cache:", error);
    }
}

app.get("/ping", (req, res) => {
    res.send("Server is alive");
});

app.get("/getstats", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (cache.count !== null) {
        return res.json({ count: cache.count, lastUpdated: cache.lastUpdated });
    } else {
        return res.status(500).json({ error: "Cache not ready yet." });
    }
});

process.on("exit", async () => {
    if (browser) await browser.close();
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
