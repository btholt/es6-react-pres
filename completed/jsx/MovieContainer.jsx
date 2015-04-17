var React = require('react');
var omdb = require('omdb-client');
// var omdb = require('./fake-omdb-client');

class MovieContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    omdb.get({id:this.props.id}, (err, data) => {
      this.setState({movie:data});
    });
  }

  render() {
    return (
      <this.props.layout
        {...this.state.movie}
      />
    );
  }
}

module.exports = MovieContainer
