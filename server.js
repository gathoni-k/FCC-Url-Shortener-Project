'use strict'

var express = require('express')
var mongoose = require('mongoose')

var cors = require('cors')

var app = express()

const dotenv = require('dotenv')
const { shortenUrl, getLongUrl } = require('./controllers/url.controllers')
dotenv.config()

// Basic Configuration
var port = process.env.PORT || 3000

/** this project needs a db !! **/
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(e => console.log(e))

app.use(cors())
/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

app.post('/api/shorturl/new', shortenUrl)
app.get('/api/shorturl/:shortcode', getLongUrl)

app.listen(port, function () {
  console.log('Node.js listening ...')
})
