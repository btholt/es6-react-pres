import React from 'react';
import omdb from 'omdb-client';
import MovieContainer from './MovieContainer';
import MovieTileLayout from './MovieTileLayout';
import MovieListLayout from './MovieListLayout';
import preload from './netflix';
import Header from './Header';
import { clone } from 'lodash';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      layout: 'list',
      results: clone(preload.Search, true),
      term: ""
    };
  }

  changeLayout(layout) {
    this.setState({layout:layout});
  }

  search(term) {
    this.setState({term:term});
    omdb.search({query:term}, (err, data) => {
      this.setState({results: data.Search});
    });
  }

  clearTerm() {
    this.setState({term:"", results: _.clone(preload.Search, true)});
  }

  render() {
    var layout;
    if (this.state.layout === 'tile') {
      layout = MovieTileLayout;
    }
    else {
      layout = MovieListLayout;
    }
    return (
      <div className="app-container">
        <Header
          changeLayout={this.changeLayout.bind(this)}
          layout={this.state.layout}
          term={this.state.term}
          search={this.search.bind(this)}
          clearTerm={this.clearTerm.bind(this)}
        />
        <div className="movies-list">
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
