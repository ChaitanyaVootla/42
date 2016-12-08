var Twitter = require('twitter');
var _ = require('underscore');
var googleTrends = require('google-trends-api');
var parseString = require('xml2js').parseString;
var https = require('https');

var client = new Twitter({
  consumer_key: 'Wye6NU1nOAMePEzOujj8AmtWS',
  consumer_secret: 'LOLyfiRd7Dj85UBNwSjhmWsB291Sq0yGfzcCYX1v81UPuQYEMV',
  access_token_key: '558008991-uDvZWkGagoseZv8xpbQW8b0J3FiL1ix2EBOUEbH8',
  access_token_secret: 'dY42RtCsfV1UkxZKBai88nnaMls1IdTzQMm5XZ5XApAZX'
});

https.get('https://news.google.com/news?cf=all&hl=en&pz=1&ned=in&output=rss',
  function (res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      //console.log(data);
      parseString(data, function (err, result) {
        console.log(result.rss.channel[0].item[0].title);
      });
    });
  }
);
 
/*client.get('trends/place', {id: 23424848, exclude: 'hashtags', limit: 100}, function(error, data, response) {
  if(error) {
    console.log(error);
  }
  else
    console.log(data[0].trends);
});*/

/*client.get('friends/ids', {screen_name: 'verified',count: 5000}, function(error, data, response) {
  if(error) {
    console.log(error);
  }
  else
    console.log(data);
});*/

/*client.get('users/lookup', {user_id: '43880302'}, function(error, data, response) {
  if(error) {
    console.log(error);
  }
  else
    console.log(data[0].id);
});*/

/*client.get('application/rate_limit_status', {}, function(error, data, response) {
  if(error) {
    console.log(error);
  }
  else{
    console.log(data.resources.friends['/friends/ids']);
  }
});*/

/*client.get('users/profile_banner', {user_id: 31348594}, function(error, data, response) {
  if(error) {
    console.log(error);
  }
  else{
    console.log(data);
  }
});*/

/*client.get('search/tweets', {q: 'amaravati land', count:20, result_type: 'recent'}, function(error, data, response) {
  if(error) {
    console.log(error);
  }
  else{
    console.log(_.map(data.statuses, function (tweet)  {
      return tweet.text;
    }));
  }
});
*/

/*googleTrends.hotTrendsDetail('IN')
.then(function(results){
    //console.log(results.rss.channel[0].item);
    console.log("Here are your google trend results!", _.map(results.rss.channel[0].item,
      function (item) {
        return item.title;
      }));
})
.catch(function(err){
    console.log("there was an error :(", err);
});
*/