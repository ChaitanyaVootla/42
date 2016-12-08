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

var twitterVerifiedMeta = sequelize.define(
	'meta', {
  twitter_id: Sequelize.STRING,
  twitter_name: Sequelize.STRING,
  twitter_cursor: Sequelize.STRING,
  twitter_friends_count: Sequelize.STRING,
  twitter_status: Sequelize.STRING},
  {indexes: [{unique: true, fields: ['twitter_id']}]}
);

module.exports = twitterVerifiedMeta;