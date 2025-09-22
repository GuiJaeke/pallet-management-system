const { DataTypes } = require('sequelize')
const bd = require('../bd/conn')


const item = bd.define('item', {
    codInterno: {
        type: DataTypes.STRING,
        primaryKey: true
    },
}, {
    timestamps: false,

    // If don't want createdAt
    createdAt: false,

    // If don't want updatedAt
    updatedAt: false,
}
)


module.exports = item