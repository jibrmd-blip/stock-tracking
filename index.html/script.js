document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("trackBtn");
  const input = document.getElementById("symbol");
  const result = document.getElementById("result");

  button.addEventListener("click", () => {
    const symbol = input.value.trim().toUpperCase();

    if (!symbol) {
      result.textContent = "⚠️ Please enter a stock symbol.";
      return;
    }

    result.innerHTML = `
      <strong>${symbol}</strong><br>
      Tracking coming soon 🚀<br>
      (Live data will be added next)
    `;
  });
});
