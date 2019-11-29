const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const PORT = process.env.PORT || 3000

const indexRouter = require('./routes/index')
const availableCurrencies = require('./routes/available-currencies')
const valueInCurrency = require('./routes/value-in-currency')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const PriceCheck = require('./utils/price-check')
const priceCheck = new PriceCheck()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use((req, res, next) => {
    req.io = io

    return next()
})

app.get('/', availableCurrencies)
app.get('/currency', valueInCurrency)

setInterval(async () => {
    const sysPrices = await priceCheck.checkSyscoinPrice()
    io.emit('sys_price_update', sysPrices)

    const currencies = Object.keys(sysPrices)
    currencies.forEach(currency => io.emit(`sys_price_update[${currency}]`, { value: sysPrices[currency] }))
}, 5000);

http.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})
