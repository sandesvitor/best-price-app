const Sequelize = require('sequelize')
const dbConfig = require('../config/config')
require('dotenv').config()

const Product = require('../models/Product')

const connection = new Sequelize(dbConfig)

Product.init(connection)

module.exports = connection