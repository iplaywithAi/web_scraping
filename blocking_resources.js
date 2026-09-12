'use strict'

import puppeteer from "puppeteer"

(async () =>{
        const browser = await puppeteer.launch({headless:false})
        const page = await browser.newPage()

        const url = "https://www.jumia.co.ke/?srsltid=AfmBOorA6D94ySRsYgALVKlP-bmALGzGoXKpeCL3pT-SysH_kthojf0W";

        
        try{
            //enable request interception
            await page.setRequestInterception(true);

            page.on('request', (req) => {
            const resourceType = req.resourceType();
            const blockedTypes = ['image', 'stylesheet', 'font', 'media'];

            if (blockedTypes.includes(resourceType)) {
            req.abort();
            } else {
            req.continue();
            }
             });

            await page.goto(url, {waitUntil: "domcontentloaded", timeout:6000})



        }catch(err){
           console.error(err.message)
        }
        finally{
           await browser.close()
        }

})()