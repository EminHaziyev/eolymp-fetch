const axios = require("axios");
const puppeteer = require("puppeteer");
const express = require("express");

const app = express();

let browser; 
(async () => {
    browser = await puppeteer.launch({ headless: "new" }); 
})();

app.get("/ping", (req, res) => {
    res.send("Server is alive");
});

app.get("/getstats", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    try {
        if (!browser) {
            return res.status(500).json({ error: "Browser is not ready" });
        }

        const url = "https://basecamp.eolymp.com/en/users/eminhazi";
        const selector = ".ui-mwp49i";

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(15000); 
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(selector, { timeout: 10000 });

        const stats = await page.$eval(selector, el => el.textContent.trim());

        await page.close(); 

        res.json({ count: stats });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

process.on("exit", async () => {
    if (browser) await browser.close();
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
