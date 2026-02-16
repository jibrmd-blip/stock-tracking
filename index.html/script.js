* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  background: linear-gradient(135deg, #020617, #0f172a);
  color: #e5e7eb;
}

header, footer {
  text-align: center;
  padding: 20px;
}

main {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.card {
  background: #020617;
  padding: 30px;
  border-radius: 16px;
  width: 360px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
}

button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #22c55e;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #16a34a;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background: #0f172a;
  border-radius: 10px;
  min-height: 50px;
}

