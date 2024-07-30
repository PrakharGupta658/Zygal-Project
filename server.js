const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const jsonFilePath = path.join(__dirname, 'data.json');

function loadData() {
  if (fs.existsSync(jsonFilePath)) {
    const fileData = fs.readFileSync(jsonFilePath);
    return JSON.parse(fileData);
  }
  return {};
}

function saveDataFun(data) {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
}

app.get('/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.post('/submit', (req, res) => {


  const number = parseInt(req.body.number, 10);
  if (isNaN(number) || number < 1 || number > 100) {
    return res.status(400).send('Invalid number');
  }

  const data = loadData();
  data[number] = (data[number] || 0) + 1;
  saveDataFun(data);

  res.redirect('/');
});

// server is start running on port 8000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
