import express from 'express'
import { join } from 'node:path'

const app = express()

app.use(express.static(join(process.cwd(), 'src', 'public')))

app.get('/simple-text', (request, response) => {
  response.status(200).set({ 'Content-Type': 'text/plain' }).send(`this is some text`)
})

app.get('/html-version', (request, response) => {
  response.status(200).set({ 'Content-Type': 'text/html' }).send(`<h1>HTML Text</h1><p>this is some text wrapped in HTML tags</p>`)
})

app.get('/concerts', (request, response) => {
  const filePath = join(process.cwd(), 'src', 'public', 'concerts.html')
  response.status(200).set({ 'Content-Type': 'text/html' }).sendFile(filePath)
})

app.listen(3000)