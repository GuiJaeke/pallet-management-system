const { DataTypes } = require('sequelize')
const bd = require('../bd/conn')

const palete = bd.define('palete', {
    title: {
        type: DataTypes.STRING,
        required: true
    },
    name: {
        type:DataTypes.STRING,
        required: true
    },
    printPage: {
        type: DataTypes.BOOLEAN,
        required: true   
    }
})
module.exports = palete
