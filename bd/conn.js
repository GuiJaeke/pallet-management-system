const { Sequelize } = require('sequelize')

const env = require('dotenv')

env.config()

const sequelize = new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        port: process.env.DB_PORT,
        host: process.env.DB_SERVER,
        dialect: 'mysql'
    }
)

try{
    sequelize.authenticate()
    sequelize.sync()
}catch(error){
    console.log(error)
}


module.exports = sequelize