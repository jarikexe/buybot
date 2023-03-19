import puppeteer from 'puppeteer';
import {faker} from '@faker-js/faker';
import {schedule} from 'node-cron';
import chalk from 'chalk';


function generateRandom(min = 21, max = 33) {

    // find diff
    let difference = max - min;

    // generate random number
    let rand = Math.random();

    // multiply with difference
    rand = Math.floor(rand * difference);

    // add with min value
    rand = rand + min;

    return rand;
}


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

const posts = [
    {post_name: "beach-towel-steel-city"},
    {post_name: "cashmere-v-insert-sweat"},
    {post_name: "clothing-and-accessory-boutiques-for-sale"},
    {post_name: "cotton-parka-with-faux"},
    {post_name: "court-dx-true-white"},
    {post_name: "dress-shirt-front-placket"},
    {post_name: "heritage-crew-t-shirt"},
    {post_name: "long-sleeve-striped-tee"},
    {post_name: "mens-nike-tennis-classic"},
    {post_name: "minimal-military-jacket"},
    {post_name: "nike-air-huarache-blue"},
    {post_name: "noisy-may-alberte-sleeve"},
    {post_name: "oversized-super-sweat"},
    {post_name: "pilcro-the-icon-flare-low-rise-jeans"},
    {post_name: "radical-loose-fit-sweat"},
    {post_name: "reign-of-glitter-tank"},
    {post_name: "seam-l-s-tee-with-tail"},
    {post_name: "skool-whispering-pink"},
    {post_name: "spring-court-b2-canvas"},
    {post_name: "stripe-heritage-scoop"},
    {post_name: "super-l-s-linen-tee"},
    {post_name: "ted-baker-womens-light"},
    {post_name: "womens-boucle-cardigan"},
    {post_name: "avec-les-filles-wide-leg-shorts"},
    {post_name: "tiny-macie-crochet-tank"},
    {post_name: "pilcro-spliced-neck-tee"}
]




schedule('*/15 * * * *', async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

    const currentBuy = shuffle(posts);
    try {
        const page = await browser.newPage();
// await page.setRequestInterception(true);
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
        await page.setViewport({
            width: 1200,
            height: 3000,
        });
        console.log(`https://webshop-56658f.ingress-daribow.ewp.live/product/${currentBuy[0].post_name}`);
        await page.goto(`https://webshop-56658f.ingress-daribow.ewp.live/product/${currentBuy[0].post_name}`);


        // SELECT count(*) FROM `wp_posts` WHERE post_status = 'wc-processing' ORDER BY `post_excerpt` ASC
        await page.waitForTimeout(2000);
        await page.click("#shop-now > .tbay-buy-now");
        await page.waitForTimeout(1000);
        await page.goto("https://webshop-56658f.ingress-daribow.ewp.live/cart/");
        await page.waitForSelector("#main .checkout-button");
        await page.click("#main .checkout-button")
        await page.waitForTimeout(1000);

        await page.waitForSelector("#main .woocommerce-billing-fields");
        await page.type('input[name=billing_first_name]', faker.name.firstName(), {delay: 20})
        await page.type('input[name=billing_last_name]', faker.name.lastName(), {delay: 20})
        await page.type('input[name=billing_address_1]', faker.address.street(), {delay: 20})
        await page.type('input[name=billing_address_2]', String(generateRandom(1, 235)), {delay: 20})
        await page.type('input[name=billing_city]', faker.address.city(), {delay: 20})
        await page.type('input[name=billing_phone]', faker.phone.phoneNumberFormat(), {delay: 20})
        await page.type('input[name=billing_postcode]', faker.address.zipCode(), {delay: 20})
        await page.type('input[name=billing_email]', faker.internet.email().toLowerCase(), {delay: 20});
        await page.waitForTimeout(1000);
        await (await page.waitForSelector('label[for=payment_method_cod]')).click()
        await page.click("#place_order");
        await page.waitForTimeout(1000);
        await page.close();
        console.log(chalk.green("Success purchase"))
    } catch (e) {
        console.log(chalk.red(`error  while buing, slug ${currentBuy[0].post_name}`));
        console.log(chalk.red(e));
    }

    await browser.close();
    return 0;
});





