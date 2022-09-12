const express = require('express')
const path = require('path')
const logger = require('electron-log');
const app = express()
const port = 17882

app.use(express.static(path.join(__dirname, '/static/')))

app.listen(port, () => {
  logger.info(`Started WebServer on port ${port}`)
})
