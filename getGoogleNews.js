'use strict'

var self = getGoogleNews;
module.exports = self;

var async = require('async');
var _ = require('underscore');
var https = require('https');
var parseString = require('xml2js').parseString;

var pages = {
  india: 'https://news.google.com/news?cf=all&hl=en&pz=1&ned=in&topic=n&output=rss',
  top:   'https://news.google.com/news?cf=all&hl=en&pz=1&ned=in&output=rss',
  world: 'https://news.google.com/news?cf=all&hl=en&pz=1&ned=in&topic=w&output=rss'
}

function getGoogleNews(req, res) {
  var data = "";

  https.get(pages[req.params.topic],
    function (response) {

      response.on('data', function (chunk) {
        data += chunk;
      });
      response.on('end',
        function () {

          parseString(data, function (err, result) {
            //console.log(result.rss.channel[0].item[0].title);
            res.send(
              _.map(result.rss.channel[0].item,
              function (item) {
                return {
                  title: item.title[0],
                  url: item.link[0]
                };
              })
              //result.rss.channel[0].item[0]
              );
          });
        }
      );
    }
  );

}
