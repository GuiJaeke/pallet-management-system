
const { Sequelize } = require('sequelize');

const sequelizeBditens = new Sequelize('bditens', 'root', '', {
  host: 'localhost',       // ou IP do servidor
  dialect: 'mysql',
});

async function buscarItens(codint) {
    const item = (await sequelizeBditens.query(`SELECT PRODUTO.codinterno, PRODUTO.descricao as descr, PRODUTO.modelo, PRODUTO.codfabricante
        as codfor, produto.locfisica as tloc from PRODUTO PRODUTO
        WHERE PRODUTO.codinterno = ${codint}`))[0][0];
    if (item == undefined) {
        console.log(item)
    } else {
        console.log(item);
        
        return(item)
    }
}

module.exports = buscarItens;