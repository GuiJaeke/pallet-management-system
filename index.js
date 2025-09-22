const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const conn = require('./bd/conn')

const paleteRoutes = require('./routes/paleteRoutes')

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    }),
)

app.use(express.json())

app.use(express.static('public'))

app.use('/palete', paleteRoutes)

app.use(function(req, res, next){
    res.status(404).redirect('/palete/home')
})
conn
    .sync()
    //.sync({force: true})
    .then(() => {
    app.listen(3001)
}).catch((err) => {   
    console.log(err)
    })