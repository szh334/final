// React
var React = require('react')
var ReactDOM = require('react-dom')

// Google Maps
var ReactGMaps = require('react-gmaps')
var {Gmaps, Marker} = ReactGMaps

// Movie data
var movieData = require('./data/movies.json')
var theatres = require('./data/theatres.json')

// Components
var Header = require('./components/Header')
var MovieDetails = require('./components/MovieDetails')
var MovieList = require('./components/MovieList')
var NoCurrentMovie = require('./components/NoCurrentMovie')
var SortBar = require('./components/SortBar')

// There should really be some JSON-formatted data in movies.json, instead of an empty array.
// I started writing this command to extract the data from the learn-sql workspace
// on C9, but it's not done yet :) You must have the csvtojson command installed on your
// C9 workspace for this to work.
// npm install -g csvtojson
// sqlite3 -csv -header movies.sqlite3 'select "imdbID" as id, "title" from movies' | csvtojson --maxRowLength=0 > movies.json
//SZ: Complete - movies.sqlite3 was piped to movies.csv and converted to json...didn't bother with imdbID as id though...
// Firebase configuration
var Rebase = require('re-base')
var base = Rebase.createClass({
  apiKey: "AIzaSyARvtk7PvrfeFU1HjcF6TcvKyw3gyUPt0Y",   // replace with your Firebase application's API key
  databaseURL: "https://buyflix-final-1155b.firebaseio.com", // replace with your Firebase application's database URL
})
  {/*SZ: this is the beginning of App, the only thing our index.html really knows about. From here, we use the react.createClass to define all objects and variables needed to create our content. At the end, we use the render function to stictch together everything we want to see*/}
var App = React.createClass({
  movieClicked: function(movie) {
    this.setState({
      currentMovie: movie
    })
  },
  movieWatched: function(movie) {
    var existingMovies = this.state.movies
    var moviesWithWatchedMovieRemoved = existingMovies.filter(function(existingMovie) {
      return existingMovie.id !== movie.id
    })
    this.setState({
      movies: moviesWithWatchedMovieRemoved,
      currentMovie: null
    })
  },
  resetMovieListClicked: function() {
    this.setState({
      movies: movieData.sort(this.movieCompareByReleased),
      currentView: 'latest'
    })
  },
  viewChanged: function(view) {
    // View is either "latest" (movies sorted by release), "alpha" (movies
    // sorted A-Z), or "map" (the data visualized)
    // We should probably do the sorting and setting of movies in state here.
    // You should really look at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      this.setState({
      currentView: view
      })
      //SZ: Use an if/else statement to determine the type of sort, and then update state.movies by sorting it by the view
      console.log(view)
      if (view === 'alpha')
        {console.log("sorted by alpha");
        this.setState({
        currentView: view,
        movies: movieData.sort(this.movieCompareByTitle),
        })}
      else if (view === 'latest')
        {console.log("sorted by latest");
        this.setState({
        currentView: view,
        movies: movieData.sort(this.movieCompareByReleased),
        })}
      else if (view === 'map')
      {console.log("sorted by map");
        this.setState({
        currentView: view
      })}
  },
  renderMovieDetails: function() {
    if (this.state.currentMovie == null) {
      return <NoCurrentMovie resetMovieListClicked={this.resetMovieListClicked} />
    } else {
      return <MovieDetails movie={this.state.currentMovie}
                           movieWatched={this.movieWatched} />
    }
  },
  renderMainSection: function() {
    if (this.state.currentView === 'map') {
      this.setState({//SZ: nothing needed for state update
    });

      return (
        //SZ: Use Gmaps react to build a map. Use the map function to return all lat and long postions and create a marker at each location
        <div className="col-sm-12">
          <h3>Here are some places to watch movies.</h3>
            <Gmaps width={'100%'}
                 height={'480px'}
                 lat={'41.9021988'}
                 lng={'-87.6285782'}
                 zoom={11}
                 loadingMessage={'Movie Theaters Loading...'}
                 params={{v: '3.exp', key: 'AIzaSyB3p_xQIXsFMDGLYNEiVkgW5fsVSUOd01c'}}>
                 {theatres.map(function(place) {//SZ: this is a loop returning an object called place with for every theatres.json record
                   return <Marker lat={place.lat} lng={place.long}/>})}
            </Gmaps>
        </div>
      )
    } else {
      return (
        <div>
          <MovieList movies={this.state.movies} movieClicked={this.movieClicked} />
          {this.renderMovieDetails()}
        </div>
      )
    }
  },
  // there's basic documentation on how a compare function can be written on the internet
  movieCompareByTitle: function(movieA, movieB) {
    if (movieA.title < movieB.title) {
      return -1
    } else if (movieA.title > movieB.title) {
      return 1
    } else {
      return 0
    }
  },
  movieCompareByReleased: function(movieA, movieB) {
    if (movieA.released > movieB.released) {
      return -1
    } else if (movieA.released < movieB.released) {
      return 1
    } else {
      return 0
    }
  },
    //SZ: we should always set an initial state if we plan to update states. We use the special getInitialState function
  getInitialState: function() {
    return {
      movies: movieData.sort(this.movieCompareByReleased),
      currentMovie: null,
      currentView: 'latest',
    }
  },
  componentDidMount: function() {
    // We'll need to enter our Firebase configuration at the top of this file and
    // un-comment this to make the Firebase database work
    base.syncState('/movies', { context: this, state: 'movies', asArray: true })

  },
  //*SZ: This is how we construct what we see. The render function puts together all of the react components (.js components) that we created elsewhere
  render: function() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <SortBar movieCount={this.state.movies.length} viewChanged={this.viewChanged}  currentView={this.state.currentView} />
        {/*SZ: Example: we render a SortBar object.
          The SortBar object is a seprate .js object we define (here, we wrote var SortBar = require('./components/SortBar'))
           We pass to it variables (props) such as movieCount. In this case, the variable movieCount is dynamic -- it is using state.movies.length*/}
          <div className="main row">
          {this.renderMainSection()}
        </div>
      </div>
    )
  }
})

ReactDOM.render(<App />, document.getElementById("app"))
