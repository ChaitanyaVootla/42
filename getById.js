'use strict'

var self = getById;
module.exports = self;

var async = require('async');
var _ = require('underscore');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'Wye6NU1nOAMePEzOujj8AmtWS',
  consumer_secret: 'LOLyfiRd7Dj85UBNwSjhmWsB291Sq0yGfzcCYX1v81UPuQYEMV',
  access_token_key: '558008991-uDvZWkGagoseZv8xpbQW8b0J3FiL1ix2EBOUEbH8',
  access_token_secret: 'dY42RtCsfV1UkxZKBai88nnaMls1IdTzQMm5XZ5XApAZX'
});

function getById(req, res) {
  client.get('users/lookup', {user_id: req.params.id},
    function(error, data, response) {
      if(error) {
        res.send(error);
      }
      else {
        res.send(data);
      }
    }
  );
}
