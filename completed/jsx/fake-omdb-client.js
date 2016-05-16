import search from './netflix';
import get from './movies';
import _ from 'lodash';


const omdb = {
  search: (params, cb) => {
    cb(null, {Search:_.shuffle(search.Search)});
  },
  get: (params, cb) => {
    cb(null, get.movies[Math.floor(Math.random()*get.movies.length)]);
  }
};

export default omdb;
