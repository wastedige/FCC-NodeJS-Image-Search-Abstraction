var express = require('express');
var Bing = require('node-bing-api')({ accKey: "Zixegkgk40uFLU03DOjsYxt2M8MGk2Vu7Ie8AONS99U=" }); // https://www.npmjs.com/package/node-bing-api
var bodyParser = require('body-parser');
var app = express();

var phrase, search_abstraction_result;
app.set('port', (process.env.PORT || 5000));

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

app.get('/', function(q, r) {
  r.send("** Image Search Abstraction Layer **<br/>" +
    "Use format /YourSearchPhrase/[?offset=n]<br/>" +
    "Default value for n is 5")
})

app.get('/:_phrase', function(q, r) {
  search_abstraction_result = [];
  var offset = q.query.offset ? q.query.offset : 5;

  Bing.images(phrase, {top: offset}, function(error, res, body){
    for (var i = 0; i < body.d.results.length; i++ ) {
      var temp_json_obj = new Object();
      temp_json_obj.snippet = body.d.results[i].Title
      temp_json_obj.url = body.d.results[i].MediaUrl
      temp_json_obj.thumbnail = body.d.results[i].Thumbnail.MediaUrl

      search_abstraction_result.push ( temp_json_obj );
    }
    r.send( search_abstraction_result );
  });
});

app.param('_phrase', function(q, r, next, _phrase){
  phrase = _phrase;
  next()
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
