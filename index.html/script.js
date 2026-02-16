document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "4IKRM7M5Z8X7CL05";
  const trackBtn = document.getElementById("trackBtn");
  const symbolInput = document.getElementById("symbol");
  const trackedList = document.getElementById("trackedList");
  const chartsContainer = document.getElementById("chartsContainer");

  let trackedStocks = [];
  let chartObjects = {}; // Store chart instances

  // Add stock button
  trackBtn.addEventListener("click", () => {
    const symbol = symbolInput.value.trim().toUpperCase();
    if (!symbol) return;
    if (trackedStocks.includes(symbol)) return alert("Already tracking this stock!");
    if (trackedStocks.length >= 5) return alert("Max 5 stocks.");

    trackedStocks.push(symbol);
    symbolInput.value = "";
    updateTrackedList();
    createChartCard(symbol);
    fetchStockData(symbol);
  });

  // Update sidebar list with remove & refresh button
  function updateTrackedList() {
    trackedList.innerHTML = "";
    trackedStocks.forEach(sym => {
      const li = document.createElement("li");
      li.textContent = sym;

      const refreshBtn = document.createElement("button");
      refreshBtn.textContent = "⟳";
      refreshBtn.title = "Refresh data";
      refreshBtn.style.background = "transparent";
      refreshBtn.style.border = "none";
      refreshBtn.style.cursor = "pointer";
      refreshBtn.onclick = () => fetchStockData(sym);

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.title = "Remove stock";
      removeBtn.style.background = "transparent";
      removeBtn.style.border = "none";
      removeBtn.style.cursor = "pointer";
      removeBtn.onclick = () => removeStock(sym);

      li.appendChild(refreshBtn);
      li.appendChild(removeBtn);
      trackedList.appendChild(li);
    });
  }

  function removeStock(symbol) {
    trackedStocks = trackedStocks.filter(s => s !== symbol);
    delete chartObjects[symbol];
    updateTrackedList();
    renderChartsContainer();
  }

  function renderChartsContainer() {
    chartsContainer.innerHTML = "";
    trackedStocks.forEach(symbol => createChartCard(symbol));
  }

  // Create chart card
  function createChartCard(symbol) {
    const card = document.createElement("div");
    card.classList.add("chart-card");
    card.id = `card-${symbol}`;
    card.innerHTML = `<h3>${symbol}</h3><div id="chart-${symbol}" style="height:300px;"></div>`;
    chartsContainer.appendChild(card);
  }

  // Fetch stock data & update chart
  async function fetchStockData(symbol) {
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&apikey=${API_KEY}`);
      const data = await response.json();
      const series = data["Time Series (15min)"];
      if (!series) throw new Error("Stock data not found");

      const candles = Object.keys(series).map(time => {
        const o = parseFloat(series[time]["1. open"]);
        const h = parseFloat(series[time]["2. high"]);
        const l = parseFloat(series[time]["3. low"]);
        const c = parseFloat(series[time]["4. close"]);
        return { time: new Date(time).getTime() / 1000, open: o, high: h, low: l, close: c };
      }).reverse();

      // Create chart if doesn't exist
      if (!chartObjects[symbol]) {
        const chartDiv = document.getElementById(`chart-${symbol}`);
        const chart = LightweightCharts.createChart(chartDiv, {
          layout: { backgroundColor: '#1e293b', textColor: '#e5e7eb' },
          grid: { vertLines: { color: '#2b2f3a' }, horzLines: { color: '#2b2f3a' } },
          rightPriceScale: { borderColor: '#2b2f3a' },
          timeScale: { borderColor: '#2b2f3a' }
        });

        const candleSeries = chart.addCandlestickSeries({
          upColor: '#22c55e',
          borderUpColor: '#22c55e',
          wickUpColor: '#22c55e',
          downColor: '#ef4444',
          borderDownColor: '#ef4444',
          wickDownColor: '#ef4444'
        });

        candleSeries.setData(candles);
        chartObjects[symbol] = { chart, candleSeries };
      } else {
        chartObjects[symbol].candleSeries.setData(candles);
      }

    } catch (err) {
      console.error(`Error fetching data for ${symbol}:`, err);
    }
  }

  // Auto-refresh every 60 seconds
  setInterval(() => {
    trackedStocks.forEach(symbol => fetchStockData(symbol));
  }, 60000);
});
