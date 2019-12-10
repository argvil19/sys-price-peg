const PriceCheck = require('../utils/price-check')
const priceCheck = new PriceCheck()

module.exports = async (req, res) => {
    const currency = req.query.currency
    let sysPrices

    if (!currency) {
        return res.status(400).send({ error: true, message: 'Missing "currency" query parameter'})
    }
    
    try {
        sysPrices = await priceCheck.checkSyscoinPrice()
    } catch(err) {
        return res.status(500).send({ error: true, message: 'Internal error' })
    }

    if (!(currency.toLowerCase() in sysPrices)) {
        return res.status(400).send({ error: true, message: 'Invalid currency' })
    }


    return res.send({ value: sysPrices[currency.toLowerCase()] })
}
