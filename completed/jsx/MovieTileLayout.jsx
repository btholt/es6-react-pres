var React = require('react');
var RatingStars = require('./RatingStars');

class MovieTileLayout extends React.Component {

  render() {
    var img = (this.props.Poster && this.props.Poster !== 'N/A') ? this.props.Poster : `public/img/fake${Math.floor(Math.random()*5) + 1}.jpg`
    return (
      <div className="movie-tile">
        <div className="movie-tile__img-container">
          <div className="movie-tile__img" style={{'backgroundImage': `url(${img})`}} />
        </div>
        <div className="movie-tile__info">
          <h1 className="movie-tile__title">{this.props.Title}</h1>
          <h2 className="movie-tile__year">({this.props.Year})</h2>
          <div className="movie-tile__stars">
            <RatingStars
              max={10}
              score={this.props.imdbRating}
            />
          </div>
        </div>
      </div>
    );

  }

}

module.exports = MovieTileLayout;
