import React from 'react';

class Header extends React.Component {
  constructor (props) {
    super(props);

    this.handleLayoutEvent = this.handleLayoutEvent.bind(this);
  }
  handleLayoutEvent (event) {
    console.log(this);
    this.props.changeLayout(event.target.value);
  }
  render () {
    return (
      <header className='app-header'>
        <div className='app-header__inner'>
          <h1 className='app-header__title'>OSFlix</h1>
          <select onChange={this.handleLayoutEvent} value={this.props.layout} className='app-header__display-select'>
            <option value='tile'>Tile</option>
            <option value='list'>List</option>
          </select>
        </div>
      </header>
    );
  }
}

export default Header;
