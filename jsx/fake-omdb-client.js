var search = require('./netflix');
var get = require('./movies');
var _ = require('lodash');


var omdb = {
  search: (params, cb) => {
    var thing = {Search:_.shuffle(search.Search)};
    console.log('thing', thing);
    cb(null, thing);
  },
  get: (params, cb) => {
    cb(null, get.movies[Math.floor(Math.random()*get.movies.length)]);
  }
};

module.exports = omdb;
