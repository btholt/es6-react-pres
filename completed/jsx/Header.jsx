var React = require('react');

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      term: ""
    };
  }

  handleLayoutEvent(e) {
    this.props.changeLayout(e.target.value);
  }

  handleTermEvent(e) {
    this.setState({term:e.target.value});
  }

  handleTermSubmit(e) {
    e.preventDefault();

    this.props.search(this.state.term);
    this.setState({term: ""});
  }

  handleClearEvent(e) {
    this.props.clearTerm();
  }

  render() {

    var searchBox;
    if (this.props.term) {
      searchBox = (
        <h3 className="app-header__term">
          {this.props.term} <a onClick={this.handleClearEvent.bind(this)} href='#'><i className="fa fa-times"/></a>
        </h3>
      );
    }
    else {
      searchBox = (
        <form onSubmit={this.handleTermSubmit.bind(this)}>
          <input value={this.state.term} onChange={this.handleTermEvent.bind(this)} className="app-header__search" type="text" placeholder="Search" />
        </form>
      );
    }

    return (
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-header__title">Fluentflix</h1>
          <select value={this.props.layout} onChange={this.handleLayoutEvent.bind(this)} className="app-header__display-select">
            <option value="tile">Tile</option>
            <option value="list">List</option>
          </select>
          {searchBox}
        </div>
      </header>
    );
  }

}

module.exports = Header;
