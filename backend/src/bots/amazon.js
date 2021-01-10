const puppeteer = require('puppeteer')
const Product = require('../db/models/Product')
require('../db/database/index')


const amazon = async () => {

    try {
        console.log('<<<< AMAZON SCRAPPING >>>>')
        const querySearch = 'placa+mae'

        var browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox'
            ]
        })
        const page = await browser.newPage()
        page.setDefaultNavigationTimeout(60000)
        page.setDefaultTimeout(60000)
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36')

        // Query string usando produtos novos, da seção de computadores e com classificação maior do que 1 estrela:     
        await page.goto(`https://www.amazon.com.br/s?k=${querySearch}&i=computers&rh=p_n_condition-type%3A13862762011%2Cp_72%3A17833783011&page=1&ref=sr_nr_p_72_1_pg_1`, { waitUntil: 'domcontentloaded' })
        console.log('Awaiting for page to load...')

        await page.waitForSelector('.a-link-normal.s-no-outline')
        console.log('Page loaded!')

        const numberOfPages = await page.$$eval('.a-pagination li', li => {
            return parseInt(li[li.length - 2].innerText)
        })
        console.log('Total of pages for navigation: [%s]', numberOfPages)

        for (let j = 0; j < numberOfPages; j++) {

            await page.goto(`https://www.amazon.com.br/s?k=${querySearch}&i=computers&rh=p_n_condition-type%3A13862762011%2Cp_72%3A17833783011&page=${j + 1}&ref=sr_nr_p_72_1_pg_${j + 1}`)
            await page.waitForSelector('.a-link-normal.s-no-outline')
            const links = await page.$$('.a-link-normal.s-no-outline')

            console.log('There are [%s] links in page [%s]', links.length, j + 1)

            for (let i = 0; i < links.length; i++) {

                await page.goto(`https://www.amazon.com.br/s?k=${querySearch}&i=computers&rh=p_n_condition-type%3A13862762011%2Cp_72%3A17833783011&page=${j + 1}&ref=sr_nr_p_72_1_pg_${j + 1}`);
                await page.waitForSelector('.a-size-base-plus.a-color-base.a-text-normal')
                await page.$$('.a-size-base-plus.a-color-base.a-text-normal')
                    .then(link => link[i].click())
                    .catch(console.log)


                const isSelector = await page.waitForSelector('#productTitle')
                    .then(() => {
                        console.log('Link loaded!')
                        return true
                    })
                    .catch(() => {
                        console.log('Selector "#productTitle" timeout...\nTrying next link: [%s]', i + 1)
                        return false
                    })

                if (!isSelector) continue

                console.log('Beginning scrapping of link [%s] of page [%s]...', i + 1, j + 1)

                const product_sku = await page.$eval('#ASIN', element => element.value)

                const product_img = await page.$eval('#imgTagWrapperId > img', element => element.dataset.oldHires)
                    .catch(err => err.message)

                const product_name = await page.$eval('#productTitle', element => element.innerText)
                    .catch(err => err.message)

                const product_manufacturer = await page.$('#bylineInfo')
                    ? await page.$eval('#bylineInfo', element => element.innerText)
                    : null

                const product_price = await page.$('#price_inside_buybox' || '.preco_desconto-cm')
                    ? await page.$eval('#price_inside_buybox' || '.preco_desconto-cm', element => {
                        return parseFloat(element.innerText
                            .match(/[^.\$]?([0-9]{1,3}.([0-9]{3}.)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/g)[0]
                            .replace(/\s/g, '')
                            .replace('.', '')
                            .replace(',', '.')
                        )
                    })
                    : null

                const product_stars = await page.$eval('.a-icon.a-icon-star', element => parseFloat(element.className.replace('a-icon a-icon-star a-star-', '').replace('-', '.')))
                    .catch(() => null)

                const product_link = await page.evaluate(() => location.href)


                const data = {
                    retailer: 'Amazon',
                    code: product_sku,
                    name: product_name,
                    manufacturer: product_manufacturer,
                    price: product_price,
                    stars: product_stars,
                    link: product_link,
                    imageUrl: product_img
                }

                const skuCheck = await Product.findOne(
                    {
                        where: { code: data.code }
                    }
                )

                if (!skuCheck) {
                    console.info('New Product!\nStoring product on database...')
                    console.info(data)
                    await Product.create(data)
                } else {
                    console.info('Product alread listed!\nUpdating...')
                    console.info(data)
                    await Product.update(
                        {
                            name: data.name,
                            manufacturer: data.manufacturer,
                            price: data.price,
                            stars: data.stars,
                            link: data.link,
                            imageUrl: data.imageUrl
                        },
                        {
                            where: {
                                retailer: 'Amazon',
                                id: skuCheck.id
                            }
                        }
                    )
                }
                console.debug('Storage completed!')

                console.log('Scrapping completed for link [%s] of page [%s]...', i + 1, j + 1)
            }

        }


        await browser.close();
        console.log('Browser closed!')

    } catch (err) {
        console.log('Amazon Scrapper Error: ', err.message)
        await browser.close();
        console.log('Browser closed!')
    }

}

module.exports = amazon