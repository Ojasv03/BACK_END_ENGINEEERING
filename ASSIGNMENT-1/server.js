const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


const fs = require('fs');
const path = require('path');

app.use((req, res, next) => {
  const logDetails = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    url: req.originalUrl,
    protocol: req.protocol,
    method: req.method,
    hostname: req.hostname,
  };

  const logString = JSON.stringify(logDetails) + '\n';
  const logFilePath = path.join(__dirname, 'requests.log');

  fs.appendFile(logFilePath, logString, (err) => {
    if (err) {
      console.error('Error logging request:', err);
    }
  });

  next();
});


app.get('/', (req, res) => {
  res.send('Request details are being logged.');
});
