'use strict'

module.exports = (err, req, res, next) => {
  if (err) {
    console.log('ERRO - ', err)
    return res.status(500).json({
      error: err.message
    })
  }

  return next()
}
