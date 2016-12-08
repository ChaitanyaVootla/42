'use strict';

var self = getIds;
module.exports = self;

var async = require('async');
var _ = require('underscore');
var Sequelize = require('sequelize');
var Twitter = require('twitter');
var twitter = require('./models/twitter.js');
var meta = require('./models/twitterVerifiedMeta.js');

var client = new Twitter({
  consumer_key: 'Wye6NU1nOAMePEzOujj8AmtWS',
  consumer_secret: 'LOLyfiRd7Dj85UBNwSjhmWsB291Sq0yGfzcCYX1v81UPuQYEMV',
  access_token_key: '558008991-uDvZWkGagoseZv8xpbQW8b0J3FiL1ix2EBOUEbH8',
  access_token_secret: 'dY42RtCsfV1UkxZKBai88nnaMls1IdTzQMm5XZ5XApAZX'
});

function getIds(req, res) {
  var bag = {};

  async.series([
      _getVerifiedAccMeta.bind(null, bag),
      _getIds.bind(null, bag),
      _upsertAccs.bind(null, bag),
      _updateCursor.bind(null, bag)
    ],
    function (err) {
      if (err){
        console.log(err);
        res.send(err);
      }
      else
        res.send(bag.response);
    }
  );
}

function _getVerifiedAccMeta (bag, next) {
  console.log("_getVerifiedAccMeta");
  meta.findOne({where: {twitter_id: '63796828'}}).then(
    function (metaItem) {
      bag.cursor = metaItem.twitter_cursor;
      return next();
    }
  ).error (function (err) {
    console.log(err);
  });
}

function _getIds (bag, next) {
  console.log("_getIds");
  client.get('friends/ids', {screen_name: 'verified',count: 5000, cursor: bag.cursor},
    function(error, data, response) {
      if(error) {
        if (error[0].code === 88) {
          console.log("rate limit exceeded");
          _rateLimitRemainingTime();
        }
        return next();
      }
      else {
        bag.ids = data.ids;
        bag.cursor = data.next_cursor_str;
        console.log("got " + bag.ids.length + " accs");
        return next();
      }
    }
  );
}

function _upsertAccs (bag, next) {
  console.log("_upsertAccs");
  var accs = _.map(bag.ids,
    function (acc) {
      return {twitter_id: acc, twitter_name: 'nyl'};
    }
  );/*
  twitter.bulkCreate(accs, { ignoreDuplicates: true }).then(function() {
    return next();
  }).catch(function (err) {
    console.log("suppressing unique constraint error");
    return next();
  });*/
  _.each(accs,
    function (acc) {
      twitter.create(acc).catch( function (err) {});
    }
  );
}

function _updateCursor (bag, next) {
  console.log("_updateCursor");
  meta.upsert({
    twitter_id: '63796828',
    twitter_cursor: bag.cursor
  }).then(function() {
    getIds();
  }).error(function (error){
    console.log(error);
  });
}

function _rateLimitRemainingTime () {
  client.get('application/rate_limit_status', {}, function(error, data, response) {
    if(error) {
      console.log(error);
    }
    else{
      console.log(data.resources.friends['/friends/ids']);
      console.log("time remaining: " + ((parseInt(data.resources.friends['/friends/ids'].reset, 10)*1000
       - parseInt((new Date).getTime(), 10))/(60000)).toFixed(2)
          + "mins");
    }
  });
}
