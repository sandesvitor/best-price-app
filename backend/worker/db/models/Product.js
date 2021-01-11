const { DataTypes, Model } = require('sequelize')


class Product extends Model {
    static init(connection) {
        super.init({
            retailer: DataTypes.STRING,
            code: DataTypes.STRING,
            name: DataTypes.STRING(1234),
            manufacturer: DataTypes.STRING,
            price: DataTypes.FLOAT,
            stars: DataTypes.FLOAT,
            link: DataTypes.STRING(1234),
            imageUrl: DataTypes.STRING(1234)

        }, {
            sequelize: connection,
            tableName: 'products'
        })

    }
}

module.exports = Product