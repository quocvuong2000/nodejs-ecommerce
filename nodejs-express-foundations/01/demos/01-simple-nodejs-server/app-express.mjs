import express from 'express'

const server = express()

function requestCallback(request, response) {
  response.status(200).send(`request received`)
}

server.get('/', requestCallback)

server.listen(3000)