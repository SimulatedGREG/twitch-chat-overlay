var express = require('express');
var app = express();

app.engine('html', require('hogan-express'));
app.use('/bower_components', express.static('bower_components'));
app.use('/includes', express.static('includes'));

app.get('/:channel', function (req, res) {
  res.locals = req.params;
  res.render('../index.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
