import express from 'express'
import bodyParser from 'body-parser'

const app = express()

function myRoutes (app) {
  app.get('/', (req, res) => {
    res.json({info: 'successfully-booted-up'})
  })
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

myRoutes(app)

let PORT = 3001

app.listen(PORT, () => {
  console.log('Server running at 127.0.0.1:' + PORT)
})
