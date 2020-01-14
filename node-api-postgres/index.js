const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

app.get('/', db.homePage)
app.get('/plays', db.getPlays)
app.post('/', db.buyTicket)
app.post('/buyTicket', db.ticketSuccess)