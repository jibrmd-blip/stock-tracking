document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "4IKRM7M5Z8X7CL05"; // Your Alpha Vantage key
  const trackBtn = document.getElementById("trackBtn");
  const symbolInput = document.getElementById("symbol");
  const trackedList = document.getElementById("trackedList");
  const chartsContainer = document.getElementById("chartsContainer");

  let trackedStocks = [];
  let chartObjects = {}; // Store chart instances for live updates

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

  function updateTrackedList() {
    trackedList.innerHTML = "";
    trackedStocks.forEach(sym => {
      const li = document.createElement("li");
      li.textContent = sym;
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.style.background = "transparent";
      removeBtn.style.border = "none";
      removeBtn.style.cursor = "pointer";
      removeBtn.onclick = () => removeStock(sym);
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

  function createChartCard(symbol) {
    const card = document.createElement("div");
    card.classList.add("chart-card");
    card.id = `card-${symbol}`;
    card.innerHTML = `<h3>${symbol}</h3><div id="chart-${symbol}" style="height:300px;"></div>`;
    chartsContainer.appendChild(card);
  }

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

      if (!chartObjects[symbol]) {
        const chartDiv = document.getElementById(`chart-${symbol}`);
        const chart = LightweightCharts.createChart(chartDiv, {
          layout: { backgroundColor: '#1e293b', textColor: '#e5e7eb' },
          grid: { vertLines: { color: '#2b2f3a' }, h

