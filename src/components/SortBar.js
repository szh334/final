var React = require('react');

var SortBar = React.createClass({
  viewChanged: function(view) {
    this.props.viewChanged(view)
  },
  render: function() {
    return (
      <div className="sort row">
        <div className="col-sm-12">
          <ul className="nav nav-pills">
            {/*we test if the currentview we passed from the state object is one of the 3. If so, we make it "active"*/}
            <li className={this.props.currentView === 'latest' ? "active" : ""}>
              <a href="#" onClick={() => this.viewChanged('latest')}>Latest Releases</a>
            </li>
            <li className={this.props.currentView === 'alpha' ? "active" : ""}>
              <a href="#" onClick={() => this.viewChanged('alpha')}>A-Z</a>
            </li>
            <li className={this.props.currentView === 'map' ? "active" : ""}>
              <a href="#" onClick={() => this.viewChanged('map')}>Where to Watch</a>
            </li>
            {/*Example, we passed a variable called movieCount into the Sortbar object. To use the variable, we use the this.prop.variable */}
            <li className="nav-text pull-right">{this.props.movieCount} movies</li>
          </ul>
        </div>
      </div>
    )
  }
})

module.exports = SortBar;
