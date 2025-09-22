const { DataTypes } = require('sequelize')
const bd = require('../bd/conn')


const conferente = bd.define('conferente', {
    nome: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    senha: {
        type: DataTypes.STRING,
        AllowNull: false
    },
    adm: {
        type: DataTypes.BOOLEAN,
        AllowNull: true
    }
}, {
    timestamps: false,

    // If don't want createdAt
    createdAt: false,

    // If don't want updatedAt
    updatedAt: false,
}
)


module.exports = conferente