const PriceCheck = require('../utils/price-check')
const priceCheck = new PriceCheck()

module.exports = async (req, res) => {
    let sysPrices
    
    try {
        sysPrices = await priceCheck.checkSyscoinPrice()
    } catch(err) {
        console.error(err)
        return res.status(500).send({ error: true, message: 'Internal error' })
    }

    const currencies = Object.keys(sysPrices)
    return res.send(currencies)
}