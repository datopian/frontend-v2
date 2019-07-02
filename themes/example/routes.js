module.exports = function (app) {
  console.log('ex1')
  app.get('/foo', (req, res) => {
    console.log('example route')
    res.render('example.html', {
      title: 'Example Theme route',
      content: {foo: 'Hello theme route'}
    })
  })
}
