'use strict'

module.exports = (err, req, res, next) => {
  if (err) {
    return res.status(500).end(err)
  }

  return next()
}
