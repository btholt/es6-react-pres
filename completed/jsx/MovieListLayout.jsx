import React from 'react';
import RatingStars from './RatingStars';

class MovieListLayout extends React.Component {

  render() {
    const img = (this.props.Poster && this.props.Poster !== 'N/A') ? this.props.Poster : 'statics/img/placeholder.png';
    return (
      <div className="movie-row">
        <div className="movie-row__img-container">
          <div className="movie-row__img" style={{'backgroundImage': `url(${img})`}} />
        </div>
        <div className="movie-row__info">
          <h1 className="movie-row__title">{this.props.Title}</h1>
          <h2 className="movie-row__year">({this.props.Year})</h2>
        </div>
        <div className="movie-row__desc">
          {this.props.Plot}
        </div>
        <RatingStars
          max={10}
          score={this.props.imdbRating}
        />
      </div>
    );
  }

}

export default MovieListLayout;
