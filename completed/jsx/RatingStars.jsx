import React from 'react';

class RatingStars extends React.Component {

  render() {
    const filled = Math.floor(this.props.score);
    const hasHalf = this.props.score - filled > .5;
    let empty = this.props.max - filled;
    let count = 0;

    const stars = [];

    for (var i = 0; i < filled; i++) {
      stars.push(
        <i key={count} className="fa fa-star" />
      );
      count++;
    }
    if (hasHalf) {
      empty--;
      stars.push(
        <i key={count} className="fa fa-star-half-o" />
      );
      count++;
    }
    for (var i = 0; i < empty; i++) {
      stars.push(
        <i key={count} className="fa fa-star-o" />
      );
      count++;
    }
    return (
      <div className="rating-stars">
        {stars.map( (el) => el )}
      </div>
    );
  }

}

export default RatingStars;
