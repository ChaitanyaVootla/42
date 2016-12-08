'use strict'

var self = fillAccs;
module.exports = self;

var async = require('async');
var _ = require('underscore');
var Sequelize = require('sequelize');
var Twitter = require('twitter');
var twitter = require('./models/twitter.js');

var client = new Twitter({
  consumer_key: 'Wye6NU1nOAMePEzOujj8AmtWS',
  consumer_secret: 'LOLyfiRd7Dj85UBNwSjhmWsB291Sq0yGfzcCYX1v81UPuQYEMV',
  access_token_key: '558008991-uDvZWkGagoseZv8xpbQW8b0J3FiL1ix2EBOUEbH8',
  access_token_secret: 'dY42RtCsfV1UkxZKBai88nnaMls1IdTzQMm5XZ5XApAZX'
});

function fillAccs(req, res) {
  var bag = {};

  async.series([
      _getUnfilledAccs.bind(null, bag),
      _getAccs.bind(null, bag),
      _upsertAccs.bind(null, bag)
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

function _getUnfilledAccs (bag, next) {
  console.log("_getUnfilledAccs");
  twitter.findAll({
    where: {twitter_name: 'nyl'},
    limit: 100,
    attributes: ['twitter_id'],
    order: 'twitter_id ASC'
  }).then(function(results){
    bag.ids = _.map(results, function (item) {
      return item.dataValues.twitter_id;
    });
    bag.foundAccs = bag.ids.length;
    return next();
  }).error(function (err) {
    console.log(err);
  });
}

function _getAccs (bag, next) {
  console.log("_getAccs");
  if(bag.foundAccs === 0 )
    return next();
  client.get('users/lookup', {user_id: bag.ids.toString()},
    function(error, data, response) {
      if(error) {
        console.log(error);
        if (!_.isUndefined(error[0]) && error[0].code === 17) {
          console.log("suspended accs found, removing");
          _removeAccsByIds(bag.ids);
        }
        if(error.errno === 'ENOTFOUND')
          console.log("network error, retrying");
        return next();
      }
      else {
        bag.accs = data;
        console.log("found " + bag.accs.length + " accs to fill");
        return next();
      }
    }
  );
}

function _upsertAccs (bag, next) {
  console.log("_upsertAccs");
  if(bag.foundAccs === 0 ){
    console.log("Finished Mining!");
    bag.response = "Finished Mining!";
    return next();
  }
  async.each(bag.accs,
    function (acc, callback){
      console.log("filling acc: " + acc.name);
      twitter.upsert({
        twitter_id: acc.id + '',
        twitter_name: acc.name,
        twitter_screen_name:acc.screen_name,
        twitter_location:acc.location,
        twitter_followers_count:acc.followers_count,
        twitter_friends_count:acc.friends_count
      })
      .then(function (user){
        callback();
      })
      .error(function (err){
         console.log('Error occured' + err);
      })
    },
    function (err) {
      console.log("finished upserting");
      if(err)
        console.log(err);
      else
        fillAccs();
    }
  );
}

function _removeAccsByIds (ids) {
  console.log("removing " + ids.length + " suspended accs");
  twitter.destroy({
    where: {
      twitter_id: {
        $in: ids
      }
    }
  })
  .then(function (accs) {
    console.log(accs);
  });
}
