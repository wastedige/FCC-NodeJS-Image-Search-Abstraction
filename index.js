var express = require('express');
var Bing = require('node-bing-api')({ accKey: "Zixegkgk40uFLU03DOjsYxt2M8MGk2Vu7Ie8AONS99U=" }); // https://www.npmjs.com/package/node-bing-api
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongodburl = 'mongodb://wastedige:salamsalam@ds021761.mlab.com:21761/heroku_273zp246';
var app = express();

var phrase, search_abstraction_result, collection;
app.set('port', (process.env.PORT || 5000));

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

MongoClient.connect(mongodburl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    // HURRAY!! We are connected. :)
    console.log('Connection established to', mongodburl);
    collection = db.collection('urls');
    // collection.drop();
    showCollection();
  }
})

app.get('/', function(q, r) {
  r.send("** Image Search Abstraction Layer **<br/>" +
    "Use format search/YourSearchPhrase/[?offset=n]<br/>" +
    "(Default value for offset is 5)<br/>" +
    "Use /history to visit recent searches"
    )
})

app.get('/history', function(q, r) {
  collection.find().toArray(function (err, result) {
    if (err) {
      console.log(err);
    } else if (result.length) {
      r.send(result);
    }
    else res.send('Problem connecting to MongoDB!')
  })
})

app.get('/search/:_phrase', function(q, r) {
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
    addUrl(phrase);
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

function showCollection() {
  collection.find().toArray(function (err, result) {
    if (err) {
      console.log(err);
    } else if (result.length) {
      console.log('Found:', result);
    }
  })
}

function addUrl(phrase) {
  console.log(phrase);
  collection.find().toArray(function (err, result) {
    if (err) {
      throw err;
    }
    // else if (result.length) {
    //       collection.update( { name: "searchhistory" }, { $push: { history: phrase } }, { update: true }, function(err, result) {
    //         if (err)
    //           console.log (err)
    //         else {
    //           showCollection();
    //         }
    //       })
    //
    // }
    else {
      var temparr = []
      // temparr.push(phrase)
      collection.insert({Phrase: phrase, Time: new Date() }, function (err, result) {
        if (err)
          throw err;
        else
          showCollection()
      })
    }
  })
}
