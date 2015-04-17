var search = require('./netflix');
var get = require('./movies');
var _ = require('lodash');


var omdb = {
  search: (params, cb) => {
    cb(null, {Search:_.shuffle(search.Search)});
  },
  get: (params, cb) => {
    cb(null, get.movies[Math.floor(Math.random()*get.movies.length)]);
  }
};

module.exports = omdb;
