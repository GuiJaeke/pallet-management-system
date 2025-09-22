const express = require('express')
const router = express.Router()

const paleteController = require('../controllers/paleteController')

router.get('/home', paleteController.home)
router.post('/home/data', paleteController.filtrarPorData)
router.post('/home/byid', paleteController.filtrarPorID)
router.post('/home/byitem', paleteController.filtrarPorItem)
router.get('/add', paleteController.addpalete)
router.post('/add', paleteController.postpalete)
router.post('/:id', paleteController.postitem)
router.get('/:id', paleteController.palete)
router.get('/print/:id', paleteController.print)
router.post('/printetq/:id', paleteController.printEtiqueta)
router.post('/delitem/:id', paleteController.delItem)
router.post('/edit/:id', paleteController.editItem)
router.post('/mult/:id', paleteController.multPalete)
router.post('/editplt/:id', paleteController.editPalete)
router.get('/att/attItens', paleteController.atualizaItens)

module.exports = router