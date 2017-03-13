var React = require('react')
var Movie = require('./Movie')

var MovieList = React.createClass({
  renderMovie: function(movie) {
    return (
      //here we render the Movie object that we create and we pass it props such as key, movie, and movieClicked
      <Movie key={movie.id}
             movie={movie}
             movieClicked={this.props.movieClicked} />
    )
  },
  render: function() {
    return (
      <div className="movies col-sm-8">
        <div className="row">
          {this.props.movies.map(this.renderMovie)}
        </div>
      </div>
    )
  }
})

module.exports = MovieList;
