const UrlStrings = require('../models/url.model')
const dns = require('dns')
const { v4: uuidv4 } = require('uuid')
const urlIsValid = (hostname) => {
  dns.lookup(hostname, (error, adddress, family) => {
    return error
  })
}
const generateCode = async () => {
  const uuidCode = uuidv4().split('-').join('')
  let min = 0
  let max = 6
  const len = uuidCode.length
  let uniqueId = uuidCode.substring(min, max)
  let idExists = await UrlStrings.findOne({ shortUrl: uniqueId })
  while (idExists && max >= len) {
    min = max
    max += 6
    uniqueId = uuidCode.substring(min, max)
    idExists = await UrlStrings.findOne({ shortUrl: uniqueId })
  }
  return uniqueId
}
module.exports = {
  shortenUrl: async (req, res) => {
    try {
      const originalUrl = req.body.url
      const url = new URL(originalUrl)
      const hostname = url.hostname

      // check if url is valid
      const isValidErr = urlIsValid(hostname)
      if (isValidErr) {
        return res.json({
          error: 'Invalid Url'
        })
      }

      // check if url is already shortened
      const urlExists = await UrlStrings.findOne({ originalUrl })
      if (urlExists) {
        return res.json({
          originaUrl: urlExists.originalUrl,
          shortUrl: urlExists.shortUrl
        })
      }

      // generate short url
      const shortUrl = await generateCode()
      const newShortUrl = new UrlStrings({
        originalUrl,
        shortUrl
      })
      await newShortUrl.save()
      return res.json({
        originalUrl,
        shortUrl
      })
    } catch (error) {
      res.json({
        error: 'invalid Url'
      })
    }
  },
  getLongUrl: async (req, res) => {
    try {
      const shortUrl = req.params.shortcode
      const urlExists = await UrlStrings.findOne({ shortUrl })
      if (!urlExists) throw Error()
      res.redirect(urlExists.originalUrl)
    } catch (error) {
      console.log(error)
      res.json({
        error: 'invalid Url'
      })
    }
  }
}
