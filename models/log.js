const { DataTypes } = require('sequelize')
const bd = require('../bd/conn')

const log = bd.define('log', {
    titleLog: {
        type: DataTypes.STRING,
        required: true
    },
    nameLog: {
        type:DataTypes.STRING,
        required: true
    },
    dataLog: {
        type: DataTypes.DATE,
        required: true
    },
    paleteId: {
        type:DataTypes.INTEGER,
        required: true
    }, 
})
module.exports = log