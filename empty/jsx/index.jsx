import React, { Component } from 'react';
import { clone } from 'lodash';
import { Search } from './netflix';

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
          <pre>
            <code>{this.state.results.map((el) => {
              return (
                <h1>{el.Title}</h1>
              );
            })}</code>
          </pre>
        </div>
      </div>
    );
  }
}

export default App;
