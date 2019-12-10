const PriceCheck = require('../utils/price-check')
const priceCheck = new PriceCheck()

module.exports = async (req, res) => {
    const from = req.query.from
    const to = req.query.to
    const amount = Number(req.query.amount)
    let toAmount
    
    try {
        toAmount = await priceCheck.convert(amount, from, to)
    } catch(err) {
        console.log(err)
        return res.status(500).send({ error: true, message: 'Internal error' })
    }

    

    return res.send({ value: toAmount })
}
