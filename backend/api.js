const axios = require('axios');

const API_KEY = '73feb218-7d95-459b-a40b-5f726d5c9c01';
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

let lastPrices = {}; // Lưu trữ giá của các đồng tiền trước đó

// Lấy thông tin coin từ API
const getTopCoins = async () => {
    try {
        const response = await axios.get(url, {
            headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
                'Accept': 'application/json'
            },
            params: {
                limit: 10,
                sort: 'volume_24h'
            }
        });

        const coins = response.data.data.map(coin => {
            const currentPrice = coin.quote.USD.price;
            const change1h = coin.quote.USD.percent_change_1h;
            const change24h = coin.quote.USD.percent_change_24h;

            // Cập nhật giá trị mới
            lastPrices[coin.symbol] = currentPrice;

            return {
                name: coin.name,
                price: currentPrice,
                symbol: coin.symbol,
                change_1h: change1h,
                change_24h: change24h,
                volume_24h: coin.quote.USD.volume_24h
            };
        });

        return coins;
    } catch (error) {
        throw new Error('Error fetching data for top coins');
    }
};

module.exports = { getTopCoins };
