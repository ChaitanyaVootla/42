'use strict';

var Sequelize = require('sequelize');
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

var twitter = sequelize.define(
	'twitter', {
	  twitter_id: Sequelize.STRING,
	  twitter_name: Sequelize.STRING,
	  twitter_screen_name: Sequelize.STRING,
	  twitter_location: Sequelize.STRING,
	  twitter_followers_count: Sequelize.INTEGER,
	  twitter_friends_count: Sequelize.INTEGER,
	  twitter_status: Sequelize.STRING},
	  {indexes: [{unique: true, fields: ['twitter_id']}]}
);

module.exports = twitter;