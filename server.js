const express = require("express")

const server = express()

server.all("/", (req, res) => {
  res.send("Spectron#6051 is online.")
})

function keepAlive() {
  server.listen(3000, () => {
    console.log("Spectron#6051 is online.")
  })
}

module.exports = keepAlive