var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('/search/:name', require('./search.js'));

app.get('/getById/:id', require('./getById.js'));

app.get('/getTweetsById/:id', require('./getTweetsById.js'));

app.get('/getGoogleNews/:topic', require('./getGoogleNews.js'));

app.get('/fillAccs', require('./fillAccs.js'));

app.get('/getIds', require('./getIds.js'));

app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});

app.get('/google', function(req, res){
  res.sendFile('google.html', {root: __dirname});
});

app.listen(4000, function () {
  console.log('app started at http://localhost:4000');
});
