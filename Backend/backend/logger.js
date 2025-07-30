const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'log.json');

module.exports = function logger(req, res, next) {
  const logEntry = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    body: req.body,
  };

  const logs = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile)) : [];
  logs.push(logEntry);
  fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

  next();
};
