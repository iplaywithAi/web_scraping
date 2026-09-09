import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({headless: false });
      
    const page = await browser.newPage();
    const urls = [
        "https://scrapingbee.com",
        "https://medium.com",
        "https://www.google.com"
        //more urlss
    ];

    const screenshots = [];

    try {
        for (const url of urls) {

            try {
                await page.goto(url, {waitUntil: "domcontentloaded", timeout: 60000  });
                

               const screenshotPath =
                    `./${url.replace(/[:\/.]/g, "_")}.jpg`;

                await page.screenshot({  path: screenshotPath,  type: "jpeg"  });
                
                             
                screenshots.push({
                    url,
                    screenshotPath
                });

                console.log(`Screenshot captured for ${url}`);

            } catch (err) {
                console.error(
                    `Failed to process ${url}: ${err.message}`
                );
            }
        }

    } finally {
        await browser.close();
    }

    console.log(screenshots);
})();

