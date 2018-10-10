'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var validUrl = require('valid-url');
var urlExists = require('url-exists');

var app = express();

// Basic Configuration
//var port = process.env.PORT || 3000;
var port = 3000;

app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));


var urls = [];

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/shorturl/new", function(req, res){

  var urlString = "https://" + req.body.url;
  if(validUrl.isUri(urlString)){  //to check if the string is a URL
    urlExists(urlString, function(err, exists){   //to check if this site exists
      if(exists){
        var urlObj = {};
        urlObj.original_url = req.body.url;
        urlObj.short_url = urls.length + 1;
        urls.push(urlObj);
        res.send(JSON.stringify(urlObj));
     }else{
      res.json({"error":"invalid URL"});
     }
   });
  }else{
    res.json({"error":"invalid URL"});
  }

});

app.get("/api/shorturl/:id",function(req,res){
  var id = req.params.id;
  urls.forEach(function(obj){
    if(id == obj.short_url){
      res.redirect("https://"+obj.original_url);
    }
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});
