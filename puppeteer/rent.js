import puppeteer from "puppeteer";
import chalk from "chalk";
import fs from "fs";

const SELECTORS = {
    ANNOUNCEMENT: ".css-qfzx1y",
    TITLE: "h6",
    SURFACE: ".css-643j0o",
    PRICE: ".css-tyui9s",
    LOCATION: `p[data-testid="location-date"]`,
    IMAGE: "img",
    URL: ".css-1apmciz .css-z3gu2d",
    NEXT_PAGE: `a[data-testid="pagination-forward"]`,
};

export async function run(city, minPrice, maxPrice){
    const URL = 
        `https://www.olx.ro/imobiliare/apartamente-garsoniere-de-inchiriat/${city}/?currency=EUR`;

    console.log("launching browser");
    const browser = await puppeteer.launch();
    console.log("creating new page");
    const page = await browser.newPage();

    await page.goto(URL);

    const data = [];
    let step = 1;

    while(true){
        console.log("Scrapping page " + chalk.bgGreen(page.url()) + "  " + chalk.bold("Page number: ") + chalk.blue(step));
        step++;

        await page.waitForSelector(SELECTORS.ANNOUNCEMENT, {timeout: 60000});
        const announcements = await page.$$(SELECTORS.ANNOUNCEMENT, {timeout: 60000});

        for(const announcement of announcements){
            let surface = "N/A";
            let location = "N/A";

            const title = await announcement.$eval(
                SELECTORS.TITLE,
                (el) => el.textContent
            );

            const price = await announcement.$eval(
                SELECTORS.PRICE,
                (el) => el.textContent
            );
            
            try{
                surface = await announcement.$eval(
                    SELECTORS.SURFACE,
                    (el) => el.textContent
                );
            } catch(e){
                console.log(chalk.red("No surface found for ") + title);
            }

            try{
                location = await announcement.$eval(
                    SELECTORS.LOCATION,
                    (el) => el.textContent
                );
            }catch(e){
                console.log(chalk.red("No location found for ") + title);
            }

            const imagePath = await announcement.$eval(
                SELECTORS.IMAGE, 
                (el) => el.src
            );

            const url = await announcement.$eval(
                SELECTORS.URL, 
                (el) => el.href
            );

            const priceNumber = price.replace(/[^0-9]/g, '');
            if(parseInt(priceNumber) > parseInt(minPrice) && parseInt(priceNumber) < parseInt(maxPrice)){
                data.push({
                    title: title,
                    price: price,
                    surface: surface,
                    location: location,
                    imagePath: imagePath,
                    url: url,
                });
            }
        }
        try{
            const nextPageURL = await page.$eval(
                SELECTORS.NEXT_PAGE,
                (el) => el.href
            );
            await page.goto(nextPageURL);
        } catch(e){
            console.log("No more pages to scrap");
            break;
        }
    }
    
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(`data${city}.json`, jsonData, (err) => {
        if(err){
            console.log("Error while writing file");
        }
        else{
            console.log("File " + chalk.grey(`data${city}`) + "written" + chalk.green("successfully!"));
        }
    });

    console.log("Closing the browser");
    await browser.close();
}