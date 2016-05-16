import React, { Component } from 'react';
import { clone } from 'lodash';
import { Search } from './netflix';
import MovieContainer from './MovieContainer';
import MovieTileLayout from './MovieTileLayout';
import MovieListLayout  from './MovieListLayout';
import Header from './Header';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      results: clone(Search),
      layout: 'tile'
    };

    this.changeLayout = this.changeLayout.bind(this);
  }
  changeLayout (layout) {
    this.setState({layout});
  }
  render () {
    const layout = (this.state.layout === 'list') ? MovieListLayout : MovieTileLayout;
    return (
      <div className='app-container'>
        <Header layout={this.state.layout} changeLayout={this.changeLayout} />
        <div className='movies-list'>
          {this.state.results.map((el) => {
            return (
              <MovieContainer
                id={el.imdbID}
                key={el.imdbID}
                layout={layout}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
