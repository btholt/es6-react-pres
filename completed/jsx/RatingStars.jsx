var React = require('react');

class RatingStars extends React.Component {

  render() {
    var filled = Math.floor(this.props.score);
    var hasHalf = this.props.score - filled > .5;
    var empty = this.props.max - filled;
    var count = 0;

    var stars = [];

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

module.exports = RatingStars;
