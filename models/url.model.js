const mongoose = require('mongoose')

const { Schema } = mongoose

const UrlSchema = new Schema({
  originalUrl: String,
  shortUrl: String
})

module.exports = mongoose.model('UrlStrings', UrlSchema)
