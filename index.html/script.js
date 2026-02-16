document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "4IKRM7M5Z8X7CL05"; // Alpha Vantage
  const button = document.getElementById("trackBtn");
  const input = document.getElementById("symbol");
  const stocksContainer = document.getElementById("stocksContainer");
  let trackedStocks = [];

  button.addEventListener("click", () => {
    const symbol = input.value.trim().toUpperCase();
    if (!symbol) return;

    if (trackedStocks.includes(symbol)) {
      alert("Stock already tracked!");
      return;
    }

    if (trackedStocks.length >= 5) {
      alert("Maximum 5 stocks at a time.");
      return;
    }

    trackedStocks.push(symbol);
    input.value = "";
    renderStocks();
  });

  function renderStocks() {
    stocksContainer.innerHTML = "";
    trackedStocks.forEach(symbol => {
      const card = document.createElement("div");
      card.classList.add("stock-card");
      card.innerHTML = `
        <div class="stock-header">
          <h3>${symbol}</h3>
          <span class="price" id="price-${symbol}">Loading...</span>
        </div>
        <canvas id="chart-${symbol}" height="80"></canvas>
      `;
      stocksContainer.appendChild(card);
      fetchStockData(symbol);
    });
  }

  async function fetchStockData(symbol) {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
      const series = data["Time Series (Daily)"];
      if (!series) throw new Error("Stock not found");

      const dates = Object.keys(series).slice(0, 7).reverse();
      const prices = dates.map(date => parseFloat(series[date]["4. close"]));

      // Update price
      const current = prices[prices.length - 1];
      const previous = prices[prices.length - 2];
      const priceElem = document.getElementById(`price-${symbol}`);
      priceElem.textContent = `$${current.toFixed(2)}`;
      priceElem.className = current >= previous ? "price-up" : "price-down";

      // Create Chart
      const ctx = document.getElementById(`chart-${symbol}`).getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: symbol,
            data: prices,
            borderColor: current >= previous ? '#22c55e' : '#ef4444',
            backgroundColor: 'rgba(0,0,0,0)',
            tension: 0.3
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#e5e7eb' } },
            y: { ticks: { color: '#e5e7eb' } }
          }
        }
      });
    } catch (err) {
      document.getElementById(`price-${symbol}`).textContent = "Error";
    }
  }

  // Auto-refresh every 60 seconds
  setInterval(() => {
    trackedStocks.forEach(symbol => fetchStockData(symbol));
  }, 60000);
});
