document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("trackBtn");
  const input = document.getElementById("symbol");
  const result = document.getElementById("result");

  const API_KEY = "4IKRM7M5Z8X7CL05"; // Your Alpha Vantage key

  button.addEventListener("click", async () => {
    const symbol = input.value.trim().toUpperCase();

    if (!symbol) {
      result.textContent = "⚠️ Please enter a stock symbol.";
      return;
    }

    result.innerHTML = "⏳ Loading...";

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      const quote = data["Global Quote"];

      if (!quote || Object.keys(quote).length === 0) {
        throw new Error("Stock not found");
      }

      const current = parseFloat(quote["05. price"]);
      const previousClose = parseFloat(quote["08. previous close"]);
      const change = (current - previousClose).toFixed(2);
      const changeColor = change >= 0 ? "#22c55e" : "#ef4444";

      result.innerHTML = `
        <h3>${symbol}</h3>
        Current Price: $${current} <span style="color:${changeColor}">(${change >= 0 ? '+' : ''}${change})</span><br>
        High: $${quote["03. high"]}<br>
        Low: $${quote["04. low"]}<br>
        Open: $${quote["02. open"]}<br>
        Previous Close: $${previousClose}
      `;
    } catch (error) {
      result.textContent = `❌ Error: ${error.message}`;
    }
  });
});

