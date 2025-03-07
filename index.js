const axios = require("axios");
const puppeteer = require("puppeteer");
const express = require("express");
const app = express();



app.get("/ping", (req, res) => {
    res.send("Server is alive");
});



app.get("/getstats", async (req,res) => {
	const url = "https://basecamp.eolymp.com/en/users/eminhazi";
	const selector = ".ui-mwp49i";
	const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        await page.goto(url, { waitUntil: "networkidle2" , timeout: 60000 });

        await page.waitForSelector(selector, { timeout: 120000 });
        const stats = await page.$$eval(selector, elements => {

            if (elements.length >= 0) {
                return elements[0].textContent.trim();
            }

        });

	const data = {
		count: stats
	}
	res.json(data);
})


app.listen(3000, ()=>{
	console.log("listening on port 3000");

});
