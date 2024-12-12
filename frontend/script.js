// fetch('/top-coins')
//     .then(response => response.json())
//     .then(data => {
//         const list = document.getElementById('coins-list');
//         data.forEach(coin => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${coin.name}</td>
//                 <td>${coin.symbol}</td>
//                 <td class="${coin.change_1h >= 0 ? 'increase' : 'decrease'}">${coin.change_1h.toFixed(2)}%</td>
//                 <td class="${coin.change_24h >= 0 ? 'increase' : 'decrease'}">${coin.change_24h.toFixed(2)}%</td>
//                 <td>$${coin.volume_24h.toLocaleString()}</td>
//             `;
//             list.appendChild(row);
//         });
//     })
//     .catch(error => console.error('Error fetching coins:', error));

document.addEventListener('DOMContentLoaded', () => {
    async function fetchTopCoins() {
        try {
            // Gọi API từ server backend
            const response = await fetch('/top-coins');
            const coins = await response.json();

            // Lấy phần tử <tbody> của bảng
            const table = document.getElementById('coins-table').querySelector('tbody');

            // Xóa nội dung cũ và thêm dữ liệu mới
            table.innerHTML = coins.map(coin => `
                <tr>
                    <td>${coin.name}</td>
                    <td>$${coin.price}</td>
                    <td>${coin.symbol}</td>
                    <td>${coin.change_1h.toFixed(2)}%</td>
                    <td>${coin.change_24h.toFixed(2)}%</td>
                    <td>$${coin.volume_24h.toLocaleString()}</td>
                    
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching top coins:', error);
        }
    }

    fetchTopCoins();
});

