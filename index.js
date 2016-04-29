var express = require('express');
var Bing = require('node-bing-api')({ accKey: "Zixegkgk40uFLU03DOjsYxt2M8MGk2Vu7Ie8AONS99U=" }); // https://www.npmjs.com/package/node-bing-api
var app = express();

app.set('port', (process.env.PORT || 5000));

// app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

var search_abstraction_result = [];
app.get('/:phrase', function(req, res) {

});

app.param('phrase', function(q, r, next, phrase){
  Bing.images(phrase, {top: 5}, function(error, res, body){
    for (var i = 0; i < body.d.results.length; i++ ) {
      var temp_json_obj = new Object();
      temp_json_obj.snippet = body.d.results[i].Title
      temp_json_obj.url = body.d.results[i].MediaUrl
      temp_json_obj.thumbnail = body.d.results[i].Thumbnail.MediaUrl

      search_abstraction_result.push ( temp_json_obj );
    }
    r.send( search_abstraction_result );
  });
  //next();
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var dateToJson = function (date) {
  var dateobj;
  if (isNaN(date) == false) {
    dateobj = new Date(date * 1000) // converts it to milliseconds
  } else {
    if ( isNaN(Date.parse(date)) == false  ) {
      dateobj = new Date(date)
    }
    else {
      dateobj = null;
    }
  }

  // compose JSON
  if (dateobj == null)
    return {
      unix: null,
      natural: null
    }
  else
    return {
      unix: dateobj.getTime() / 1000,
      natural: dateobj.toDateString()
    }
}
