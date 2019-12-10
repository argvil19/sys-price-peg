const fetch = require('isomorphic-fetch')

module.exports = class PriceCheck {
    constructor() {
        this.COINGECKO_SYSCOIN_URL = 'https://api.coingecko.com/api/v3/coins/{coin}'
        this.MOST_FREQUENT_COINS = {
            'btc': 'bitcoin',
            'eth': 'ethereum',
            'sys': 'syscoin'
        }
    }

    getEndpointForCoin(coin) {
        return this.COINGECKO_SYSCOIN_URL.replace('{coin}', coin in this.MOST_FREQUENT_COINS ? this.MOST_FREQUENT_COINS[coin] : coin )
    }

    async checkPriceForCoin(coin) {
        try {
            let res = await fetch(this.getEndpointForCoin(coin))
            res = await res.json()

            return res.market_data.current_price
        } catch(err) {
            throw err
        }
    }

    async convert(amount, from, to) {
        const pricesFrom = await this.checkPriceForCoin(from)

        if (!(to in pricesFrom)) {
            try {
                // Doesnt contain target currency, lets try to use USD as middleware
                const pricesTo = await this.checkPriceForCoin(to)
                const toFiatValue = pricesTo['usd']
                const fromFiatValue = pricesFrom['usd']
                const fromAmountInUsd = fromFiatValue * amount

                return fromAmountInUsd * (1 / toFiatValue)
            } catch (err) {
                throw new Error('Sorry, cant convert currency')
            }
        }

        return amount * pricesFrom[to]
    }

    checkSyscoinPrice() {
        return this.checkPriceForCoin('sys')
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
