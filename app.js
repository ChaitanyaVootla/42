var express = require('express');
var app = express();
var https = require('https');
var Sequelize = require('sequelize');
var Twitter = require('twitter');
var async = require('async');
var schedule = require('node-schedule');
var _ = require('underscore');
var sequelize = new Sequelize('admin', 'postgres', '1@Enterthedragon', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false
});
var client = new Twitter({
  consumer_key: 'Wye6NU1nOAMePEzOujj8AmtWS',
  consumer_secret: 'LOLyfiRd7Dj85UBNwSjhmWsB291Sq0yGfzcCYX1v81UPuQYEMV',
  access_token_key: '558008991-uDvZWkGagoseZv8xpbQW8b0J3FiL1ix2EBOUEbH8',
  access_token_secret: 'dY42RtCsfV1UkxZKBai88nnaMls1IdTzQMm5XZ5XApAZX'
});

var twitter = sequelize.define('twitter', {
  twitter_id: Sequelize.STRING,
  twitter_name: Sequelize.STRING,
  twitter_screen_name: Sequelize.STRING,
  twitter_location: Sequelize.STRING,
  twitter_followers_count: Sequelize.STRING,
  twitter_friends_count: Sequelize.STRING,
  twitter_status: Sequelize.STRING},
  {indexes: [{unique: true, fields: ['twitter_id']}]}
 );

var meta = sequelize.define('meta', {
  twitter_id: Sequelize.STRING,
  twitter_name: Sequelize.STRING,
  twitter_cursor: Sequelize.STRING,
  twitter_friends_count: Sequelize.STRING,
  twitter_status: Sequelize.STRING},
  {indexes: [{unique: true, fields: ['twitter_id']}]}
 );

sequelize.sync();

app.get('/', function (req, res) {
  function _fillAccs (){
    twitter.findAll({
      where: {twitter_name: 'nyl'},
      limit: 100,
      attributes: ['twitter_id'],
      order: 'twitter_id ASC'
    }).then(function(results){
        var ids = _.map(results, function (item) {
          return item.dataValues.twitter_id;
        });
        console.log(ids);
        client.get('users/lookup', {user_id: ids.toString()}, function(error, data, response) {
        if(error) {
          console.log(error);
        }
        else {
          async.each(data,function(acc, callback){
            console.log("filling acc: " + acc.name);
            //console.log(acc);
            twitter.upsert({
                  twitter_id: acc.id + '',
                  twitter_name: acc.name,
                  twitter_screen_name:acc.screen_name,
                  twitter_location:acc.location,
                  twitter_followers_count:acc.followers_count,
                  twitter_friends_count:acc.friends_count
              })
            .then(function(user){
              callback();
            })
            .error(function(err){
               console.log('Error occured' + err);
            })
          }, function(err) {
            console.log("finished upserting");
            if(err)
              console.log(err);
            else
              _fillAccs();
          });
        }
      });
    });
  }
  _fillAccs();
});

app.get('/loadIds', function (req, res) {
  function getIds () {
    meta.findOne({where: {twitter_id: '63796828'}}).then(
      function (metaItem) {
        console.log("cursor:" + metaItem.twitter_cursor);
        client.get('friends/ids', {screen_name: 'verified',count: 5000, cursor: metaItem.twitter_cursor},
          function(error, data, response) {
            if(error) {
              console.log(error);
            }
            else {
              console.log(data);
              async.each(data.ids,
                function(acc,callback){
                  twitter.findOne({where: {twitter_id: '' + acc}}).then(
                    function (item) {
                      if (!item) {
                        // Item not found, create a new one
                        twitter.create({
                          twitter_id: acc,
                          twitter_name: 'nyl'
                        }).then(function() {
                          //upsert next cursor
                          meta.upsert({
                            twitter_id: '63796828',
                            twitter_cursor: data.next_cursor_str
                          }).then(function() {
                            callback();
                          }).error(function (error){
                            console.log(error);
                          });

                        }).error(function (err) {
                            console.log(err);
                        });
                      }
                  });
                }, function() {
                  console.log("finished upserting");
                  if(err)
                    console.log(err);
                  else
                    getIds();
                }
              );
            }
          });
      });
    
  }
  getIds();
});

app.get('/meta', function(req, res) {
  client.get('users/lookup', {screen_name: 'verified'},
    function (err, data, response) {
      if(err)
        console.log(err);
      else
        meta.upsert({
          twitter_id: data[0].id + '',
          twitter_name: data[0].name,
          twitter_friends_count:data[0].friends_count
        })
        .then(function(user){
          res.send(data[0]);
        })
        .error(function(err){
           console.log('Error occured' + err);
        });
    });
});

app.listen(3000, function () {
  console.log('app started at http://localhost:3000');
});