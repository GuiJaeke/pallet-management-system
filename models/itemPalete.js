const { DataTypes } = require('sequelize')
const bd = require('../bd/conn')
const palete = require('./palete')
const item = require('./item')


const itemPalete = bd.define('itemPalete', {
    quant: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})
item.belongsToMany(palete, { through: itemPalete })
palete.belongsToMany(item, { through: itemPalete })

module.exports = itemPalete