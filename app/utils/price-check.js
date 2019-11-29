const fetch = require('isomorphic-fetch')

module.exports = class PriceCheck {
    constructor() {
        this.COINGECKO_SYSCOIN_URL = 'https://api.coingecko.com/api/v3/coins/syscoin'
    }

    async checkSyscoinPrice() {
        try {
            let res = await fetch(this.COINGECKO_SYSCOIN_URL)
            res = await res.json()

            return res.market_data.current_price
        } catch(err) {
            throw err
        }
    }

    async getSyscoinPriceIn(currency) {
        let sysPrices
        const lowerCurrency = currency.toLowerCase()

        try {
            sysPrices = await this.checkSyscoinPrice()
        } catch(err) {
            throw err
        }

        if (!(lowerCurrency in sysPrices)) {
            throw new Error(`${currency} is not a valid currency`)
        }

        return sysPrices[lowerCurrency]
    }
}
