module.exports = function (app) {
  app.get('/mine', (req, res) => {
    res.send('HELLO MINE')
  })
}
