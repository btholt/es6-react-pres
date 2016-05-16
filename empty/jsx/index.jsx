import React, { Component } from 'react';
import { clone } from 'lodash';
import { Search } from './netflix';
import MovieContainer from './MovieContainer';
import MovieTileLayout from './MovieTileLayout';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      results: clone(Search)
    };
  }
  render () {
    return (
      <div className='app-container'>
        <div className='movies-list'>
          {this.state.results.map((el) => {
            return (
              <MovieContainer
                id={el.imdbID}
                key={el.imdbID}
                layout={MovieTileLayout}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
