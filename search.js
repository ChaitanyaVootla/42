'use strict'

var self = search;
module.exports = self;

var async = require('async');
var _ = require('underscore');
var twitter = require('./models/twitter.js');

function search(req, res) {
  twitter.findAll({
    where: {
      twitter_name: {
        $not: 'nyl',
        $ilike: '%' + req.params.name +'%'
      }
    },
    limit: 10,
    order: 'twitter_followers_count DESC'
  }).then(function(results){
      res.send(_.map(results, function(item){
        return {name:item.twitter_name, screen_name:item.twitter_screen_name,
          count:item.twitter_followers_count, id:item.twitter_id};
      }));
  });
}
