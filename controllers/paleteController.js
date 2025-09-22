const palete = require('../models/palete')
const itemPalete = require('../models/itemPalete')
const item = require('../models/item')
const log = require('../models/log')
const conferente = require('../models/conferente')
const moment = require('moment')
const sequelize = require('../bd/conn')
const { Sequelize } = require('sequelize');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const obterDataAtual = require('../utils/data') 
const buscarItens = require('../utils/buscarItens') 

module.exports = class paleteController {
    static async home(req, res) {
        const paletes = await palete.findAll({ order: [['createdAt', 'DESC']], limit: 40, raw: true })
        paletes.map(data => {
            data.createdAt = moment(data.createdAt).format('DD/MM/yyyy, HH:mm')
            return data
        });
        return res.render('home', { paletes: paletes })
    }
    static async filtrarPorData(req, res) {
        const datainicio = req.body.data
        const datafim = req.body.datafim
        let novaData = new Date(datafim);
        novaData.setDate(novaData.getDate() + 1);
        if (datainicio > datafim) { // Valida se a data de inicio é maior que a data fim
            const paletes = await palete.findAll({ order: [['createdAt', 'DESC']], raw: true })
            paletes.map(data => {
                data.createdAt = moment(data.createdAt).format('DD/MM/yyyy, HH:mm')
                return data
            });
            const errordata = true
            return res.render('home', { paletes: paletes, datainicio, errordata })
        }
        const paletes = await palete.findAll({ order: [['createdAt', 'DESC']], raw: true, where: { createdAt: { [Sequelize.Op.gt]: datainicio, [Sequelize.Op.lt]: novaData } } })
        paletes.map(data => {
            data.createdAt = moment(data.createdAt).format('DD/MM/yyyy, HH:mm')
            return data
        });

        return res.render('home', { paletes: paletes, datainicio })
    }
    static async filtrarPorID(req, res) {
        const id = req.body.palete
        var pesquisaid = true
        try {
            const paletes = await palete.findOne({ raw: true, where: { id: id } })
            const data = moment(paletes.createdAt).format('DD/MM/yyyy, HH:mm')
            return res.render('home', { paletes: paletes, data, pesquisaid })
        } catch (error) {
            const paletes = await palete.findAll({ order: [['createdAt', 'DESC']], limit: 40, raw: true })
            paletes.map(data => {
                data.createdAt = moment(data.createdAt).format('DD/MM/yyyy, HH:mm')
                return data
            });
            const pltNaoExiste = true
            return res.render('home', { paletes: paletes, pltNaoExiste })
        }
    }
    static async filtrarPorItem(req, res) {
        const codinterno = req.body.item
        const paletes = []
        var itemNaoExiste = false
        try {
            const pesqpaletes = await palete.findAll({ include: {model: item, where: {codInterno: codinterno}}, order: [['createdAt', 'DESC']]})
            pesqpaletes.forEach(data => {
                paletes.push(data.dataValues)
            })
            paletes.map(data => {
                data.createdAt = moment(data.createdAt).format('DD/MM/yyyy, HH:mm')
                return data
            });
            if (paletes.length == 0) {
                itemNaoExiste = true
            }
            return res.render('home', { paletes: paletes, itemNaoExiste})
        } catch (error) {
            const paletes = await palete.findAll({ order: [['createdAt', 'DESC']], limit: 40, raw: true })
            paletes.map(data => {
                data.createdAt = moment(data.createdAt).format('DD/MM/yyyy, HH:mm')
                return data
            });
            console.log(error);
            return res.render('home', { paletes: paletes, itemNaoExiste })
        }
    }
    static async addpalete(req, res) {
        const Conferente = await conferente.findAll({ raw: true })
        res.render('addpalete', { conferente: Conferente })
    }
    static async postpalete(req, res) {
        const title = req.body.title
        const name = req.body.name
        if (name == 'Sel') {
            const error = true
            const Conferente = await conferente.findAll({ raw: true })
            return res.render('addpalete', { error, conferente: Conferente })
        }
        const idPalete = await palete.create({ title, name, print: 0 })
        res.redirect(`/palete/${idPalete.id}`)
    }
    static async palete(req, res) {
        const id = req.params.id
        const paletes = await palete.findOne({ include: item, itemPalete, where: { Id: id } })
        const logs = await log.findAll({ order: [['createdAt', 'DESC']], where: {paleteId: id}, raw: true})
        logs.map(data => {
            data.dataLog = moment(data.dataLog).format('DD/MM/yyyy')
            return data
        });
        const datas = moment(paletes.updatedAt).format('DD/MM/yyyy')
        const hora = moment(paletes.updatedAt).format('HH:mm')
        const title = true
        const codloc = []
        for (let i = 0; i < paletes.items.length; i++) {
            const item = await buscarItens(paletes.items[i].dataValues.codInterno) //criada uma função em um modulo para deixar o codigo mais clean
            codloc.push({ item, qtd: `${paletes.items[i].dataValues.itemPalete.quant}`, paleteid: `${id}`, printPage: paletes.dataValues.printPage, hora: `${paletes.items[i].dataValues.itemPalete.createdAt}` })
        }
        codloc.sort((a, b) => {
            return a.hora.localeCompare(b.hora)
        })
        return res.render('add', { palete: paletes.get({ plain: true }), datas, title, codloc: codloc, hora, logs })
    }
    static async print(req, res) {
        const id = req.params.id

        const paletes = await palete.findOne({ include: item, itemPalete, where: { Id: id } })
        const datas = moment(paletes.updatedAt).format('DD/MM/yyyy')
        const print = true
        const title = true
        const codloc = []
        let paleteGrande = false
        let unicoItem = false
        let printItemUnico = null
        for (let i = 0; i < paletes.items.length; i++) {
            const item = await buscarItens(paletes.items[i].dataValues.codInterno) //criada uma função em um modulo para deixar o codigo mais clean
            codloc.push({ item, qtd: `${paletes.items[i].dataValues.itemPalete.quant}`, paleteid: `${id}`, printPage: paletes.dataValues.printPage, hora: `${paletes.items[i].dataValues.itemPalete.createdAt}` })
        }
        codloc.sort((a, b) => {
            return a.hora.localeCompare(b.hora)
        })
        const printPage = true
        const update = {
            printPage
        }
        if (paletes.items.length > 20) {
            paleteGrande = true
        }
        if (paletes.items.length < 2) {
            unicoItem = true
            printItemUnico = codloc[0]

        }
        palete.update(update, { where: { id: id } })
        return res.render('print', { palete: paletes.get({ plain: true }), datas, title, codloc: codloc, print, paleteGrande, unicoItem, printItemUnico })
    }
    static async printEtiqueta(req, res) {
        const id = req.params.id
        const data = req.body.data
        const hora = req.body.hora

        async function criaETQ(id) {
            fs.writeFile('ETIQUETA.prn', 'CT~~CD,~CC^~CT~\n', (err) => {
                fs.appendFile('ETIQUETA.prn', '^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR4,4~SD10^JUS^LRN^CI0^XZ\n', (err) => {
                    fs.appendFile('ETIQUETA.prn', '^XA\n', (err) => {
                        fs.appendFile('ETIQUETA.prn', '^MMT\n', (err) => {
                            fs.appendFile('ETIQUETA.prn', '^PW831\n', (err) => {
                                fs.appendFile('ETIQUETA.prn', '^LL1239\n', (err) => {
                                    fs.appendFile('ETIQUETA.prn', '^LS0\n', (err) => {
                                        fs.appendFile('ETIQUETA.prn', '^FT710,195^A0R,87,266^FH\^FDPALETE^FS\n', (err) => {
                                            fs.appendFile('ETIQUETA.prn', `^FT245,73^A0R,383,379^FH\^FD00${id}^FS\n`, (err) => {
                                                fs.appendFile('ETIQUETA.prn', `^FT23,38^A0R,85,84^FH\^FDData: ${data}^FS\n`, (err) => {
                                                    fs.appendFile('ETIQUETA.prn', `^FT33,794^A0R,85,84^FH\^FDHora: ${hora}^FS\n`, (err) => {
                                                        fs.appendFile('ETIQUETA.prn', '^PQ1,0,1,Y^XZ\n', (err) => {
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });

        }
        async function imprimeETQ() {
            await criaETQ(id)
            const pastaAnterior = path.join(__dirname, '..')

            const caminhoDoArquivo = path.join(pastaAnterior, 'ETIQUETA.prn')
            setTimeout(function () {
                const comando = `cp ${caminhoDoArquivo} \\\\192.168.3.26\\vagner`
                exec(comando, (err, stdout, stderr) => {
                    if (err) {
                        console.error(`Erro ao executar o comando: ${err}`);
                        return;
                    }

                    console.log(`Arquivo enviado para a impressora com sucesso:\n${stdout}`);

                    if (stderr) {
                        console.error(`Erro no comando:\n${stderr}`);
                    }
                });
            }, 850)

        }
        imprimeETQ()
        const printPage = true
        const update = {
            printPage
        }
        palete.update(update, { where: { id: id } })
        await res.redirect(`/palete/${id}`)
    }
    static async editPalete(req, res) {
        const paleteId = req.params.id
        const nameLog = req.body.name
        const data = req.body.data
        function formatarDataParaBanco(dataString) {
            // Divide a data no formato dd/mm/yyyy
            const partes = dataString.split('/');
            const dia = partes[0];
            const mes = partes[1];
            const ano = partes[2];
          
            // Retorna no formato yyyy-mm-dd
            return `${ano}-${mes}-${dia}`;
        }
    
        const dataLog = formatarDataParaBanco(data);
        const titleLog = ''
        const Log = {
            titleLog,
            nameLog,
            dataLog,
            paleteId
        }
        const senha = req.body.senha
        try {const Conferente = await conferente.findOne({where: {senha: senha}, raw: true})
        if (Conferente.adm == true ) {
            await log.create(Log)
            const name = Conferente.nome
            const printPage = false
            const update = {
                name,
                printPage
            }
            await palete.update(update, { where: { id: paleteId } })
            await res.redirect(`/palete/${paleteId}`)
        } else {
            res.redirect(`/palete/${paleteId}`)
        }} catch (error) {
            console.log(error);
            res.redirect(`/palete/${paleteId}`)
        }
    }
    static async delItem(req, res) {
        const paleteId = req.body.palete
        const itemCodInterno = req.body.codInterno
        await itemPalete.destroy({ where: { itemCodInterno: itemCodInterno, paleteId: paleteId } })
        res.redirect(`/palete/${paleteId}`)
    }
    static async editItem(req, res) {
        const paleteId = req.body.palete
        const itemCodInterno = req.body.codInterno
        const quant = req.body.newQuant
        if (quant <= 0) {
            const id = req.params.id
            const paletes = await palete.findOne({ include: item, itemPalete, where: { Id: id } })
            const datas = moment(paletes.updatedAt).format('DD/MM/yyyy')
            const title = true
            const errorQuant = true
            const codloc = []
            for (let i = 0; i < paletes.items.length; i++) {
                const item = await buscarItens(paletes.items[i].dataValues.codInterno) //criada uma função em um modulo para deixar o codigo mais clean
                codloc.push({ item, qtd: `${paletes.items[i].dataValues.itemPalete.quant}`, paleteid: `${id}`, printPage: paletes.dataValues.printPage, hora: `${paletes.items[i].dataValues.itemPalete.createdAt}` })
            }
            codloc.sort((a, b) => {
                return a.item.tloc.localeCompare(b.item.descr)
            })
            return res.render('add', { palete: paletes.get({ plain: true }), datas, title, codloc: codloc, errorQuant })
        }
        const newQuant = {
            quant
        }
        await itemPalete.update(newQuant, { where: { paleteId: paleteId, itemCodInterno: itemCodInterno } })
        res.redirect(`/palete/${paleteId}`)
    }
    static async multPalete(req, res) {
        const paleteId = req.body.palete
        const itemCodInterno = req.body.pltcodinterno
        const quant = req.body.quant
        const name = req.body.name
        const title = req.body.title
        const vezes = req.body.vezes
        const novosPaletes = []
        for (let i = 1; i <= vezes; i++) {
            const idPalete = await palete.create({ title, name, printPage: 1 })
            const itempalete = {
                quant: quant,
                itemCodInterno: itemCodInterno,
                paleteId: idPalete.id
            }
            await itemPalete.create(itempalete)
            novosPaletes.push(idPalete.id)
        }

        const paletes = await palete.findAll({ order: [['createdAt', 'DESC']], limit: 40, raw: true })
        paletes.map(data => {
            data.createdAt = moment(data.createdAt).format('DD/MM/yyyy, HH:mm')
            return data
        });
        return res.render('home', { paletes: paletes, novosPaletes: novosPaletes })
    }
    static async postitem(req, res) {
        const paleteId = req.params.id
        const quant = req.body.quant
        const itemCodInterno = req.body.codinterno
        if (!itemCodInterno || !quant) { // Valida se o usuario preencheu os campos
            const id = req.params.id
            const paletes = await palete.findOne({ include: item, itemPalete, where: { Id: id } })
            const datas = moment(paletes.updatedAt).format('DD/MM/yyyy')
            const title = true
            const error = true
            const codloc = []
            for (let i = 0; i < paletes.items.length; i++) {
                const item = await buscarItens(paletes.items[i].dataValues.codInterno) //criada uma função em um modulo para deixar o codigo mais clean
                codloc.push({ item, qtd: `${paletes.items[i].dataValues.itemPalete.quant}`, paleteid: `${id}`, printPage: paletes.dataValues.printPage, hora: `${paletes.items[i].dataValues.itemPalete.createdAt}` })
            }
            codloc.sort((a, b) => {
                return a.item.tloc.localeCompare(b.item.descr)
            })
            return res.render('add', { palete: paletes.get({ plain: true }), datas, title, codloc: codloc, error })
        }
        try {
            const findItem = await item.findOne({ where: { codInterno: itemCodInterno }, raw: true })
            if (!findItem) {
                const id = req.params.id
                const paletes = await palete.findOne({ include: item, itemPalete, where: { Id: id } })
                const datas = moment(paletes.updatedAt).format('DD/MM/yyyy')
                const title = true
                const errorsql = true
                const codloc = []
                for (let i = 0; i < paletes.items.length; i++) {
                    const item = await buscarItens(paletes.items[i].dataValues.codInterno) //criada uma função em um modulo para deixar o codigo mais clean
                    codloc.push({ item, qtd: `${paletes.items[i].dataValues.itemPalete.quant}`, paleteid: `${id}`, printPage: paletes.dataValues.printPage, hora: `${paletes.items[i].dataValues.itemPalete.createdAt}` })
                }
                codloc.sort((a, b) => {
                    return a.item.tloc.localeCompare(b.item.descr)
                })
                return res.render('add', { palete: paletes.get({ plain: true }), datas, title, codloc: codloc, errorsql })
            }
            const [itempalete, criado] = await itemPalete.findOrCreate({
                where: { itemCodInterno: itemCodInterno, paleteId: paleteId },
                defaults: {
                    quant: quant,
                    itemCodInterno: itemCodInterno,
                    paleteId: paleteId
                }
            })
            if (criado) {
                console.log('item adicionado ao palete',)
            } else {
                console.log('item já existe no palete');
                const newQuant = parseInt(itempalete.dataValues.quant) + parseInt(quant)
                await itemPalete.update({ quant: newQuant }, { where: { paleteId: paleteId, itemCodInterno: itemCodInterno } })
            }
            res.redirect(`/palete/${paleteId}`)
        } catch (error) {
            console.log(error)
            const id = req.params.id
            const paletes = await palete.findOne({ include: item, itemPalete, where: { Id: id } })
            const datas = moment(paletes.createdAt).format('DD/MM/yyyy')
            const title = true
            const errorsql2 = true
            const codloc = []
            for (let i = 0; i < paletes.items.length; i++) {
                const item = await buscarItens(paletes.items[i].dataValues.codInterno) //criada uma função em um modulo para deixar o codigo mais clean
                codloc.push({ item, qtd: `${paletes.items[i].dataValues.itemPalete.quant}`, paleteid: `${id}`, printPage: paletes.dataValues.printPage, hora: `${paletes.items[i].dataValues.itemPalete.createdAt}` })
            }
            codloc.sort((a, b) => {
                return a.item.tloc.localeCompare(b.item.descr)
            })
            return res.render('add', { palete: paletes.get({ plain: true }), datas, title, codloc: codloc, errorsql2 })
        }
    }
    static async atualizaItens(req, res) {
        const itens = (await sequelize.query("select * from sqlserverdb.BDhomologa.dbo.PRODUTOCAD codInterno"))[0]
        let adicionados = 0
        for(const Item of itens){
        try {
            await item.create({codInterno: Item.codinterno})        
            console.log('inserido') 
            adicionados = adicionados + 1
        } catch (error) {

        }
    }
        res.send('Foi adicionado ' + adicionados + ' produtos.')
    }
}
