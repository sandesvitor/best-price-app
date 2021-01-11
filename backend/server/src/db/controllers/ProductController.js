const Product = require('../models/Product')
const { Op } = require('sequelize')

module.exports = {

    async index(req, res) {
        try {
            console.log('Trying to GET LIST of Products!')
            console.debug('Applying query values OR default values:')

            const pageNumber = req.query.pg
                ? parseInt(req.query.pg)
                : 1

            const pageLimit = req.query.pl
                ? parseInt(req.query.pl)
                : '30'

            const manufacturers = req.query.mn
                ? req.query.mn
                : await Product.findAll({ attributes: ['manufacturer'] })
                    .then(res => JSON.parse(JSON.stringify(res)))
                    .then(data => {
                        const mArray = data
                            .filter(f => f.manufacturer !== null)
                            .map(m => m.manufacturer.trim())
                        return [...new Set(mArray)]
                    })

            const maxPrice = req.query.mp
                ? parseFloat(req.query.mp)
                : await Product.max('price')

            const retailers = req.query.rt
                ? req.query.rt
                : await Product.findAll({ attributes: ['retailer'] })
                    .then(res => JSON.parse(JSON.stringify(res)))
                    .then(data => {
                        const rArray = data
                            .filter(f => f.retailer !== null)
                            .map(m => m.retailer.trim())
                        return [...new Set(rArray)]
                    })


            const orderByPrice = req.query.ob_p
                ? req.query.ob_p
                : 'DESC'

            const rating = req.query.sr
                ? req.query.sr
                : 4

            const queryHash = {
                order: [['price', orderByPrice === '1' ? 'ASC' : 'DESC']],
                where: {

                    manufacturer: { [Op.and]: [manufacturers] },
                    price: { [Op.lte]: maxPrice },
                    retailer: { [Op.and]: [retailers] },
                    stars: { [Op.gte]: rating }
                }
            }

            const products = await Product.findAll(queryHash)
            console.info('\nQuery data from req.query:')
            console.info(req.query)


            // Calculating pagination:
            const startIndex = (pageNumber - 1) * pageLimit
            const endIndex = pageNumber * pageLimit

            const productsArray = JSON.parse(JSON.stringify(products))
            const totalPages = (productsArray.length % pageLimit) !== 0
                ? parseInt(productsArray.length / pageLimit) + 1
                : productsArray.length / pageLimit

            const results = {}
            const productsResults = productsArray.slice(startIndex, endIndex)
            console.info('\nCreating meta data for pagination:')

            results.results = productsResults

            results.totalPages = totalPages

            if (endIndex < productsArray.length) {
                results.next = {
                    page: pageNumber + 1,
                    limite: pageLimit,
                }
            }

            if (startIndex > 0) {
                results.previous = {
                    page: pageNumber - 1,
                    limite: pageLimit,
                }
            }

            console.debug(results)
            console.info('\nSending [%s] products for page [%s]', pageLimit, pageNumber)
            return res.status(200).json(results)

        } catch (ex) {
            console.log('Error: ', ex.message)
            return res.status(500)
        }
    },

    async getMetaValues(req, res) {
        try {
            const metaValue = req.params.key
            if (metaValue === 'max') {
                console.log('Trying to GET max Price Value in PRODUCTS TABLE')

                const maxPrice = await Product.max('price')

                return res.status(200).json(maxPrice)
            } else if (metaValue === 'man') {
                console.log('Trying to GET all unique manufacturers in PRODUCTS TABLE')

                const allManufacturers = await Product.findAll({
                    attributes: ['manufacturer'],
                    where: {
                        price: { [Op.gte]: 4000 }
                    }
                })
                    .then(res => JSON.parse(JSON.stringify(res)))
                    .then(data => {
                        const mArray = data
                            .filter(f => f.manufacturer !== null)
                            .map(m => m.manufacturer.trim())
                        return [...new Set(mArray)]
                    })
                return res.send(allManufacturers)
            }

        } catch (ex) {
            console.log('Error: ', ex.message)
            return res.status(500)
        }
    }
}