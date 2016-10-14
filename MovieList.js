'use strict';

import React, { Component } from 'react';
var ReactNative = require('react-native');
var {
  ActivityIndicator,
  ListView,
  Platform,
  StyleSheet,
  Text,
  View,
  Navigator,
    ActivityIndicator
} = ReactNative;

var MovieCell = require('./MovieCell');
var MovieScreen = require('./MovieScreen');

var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/';
var API_KEYS = [
  '7waqfqbprs7pajbz28mqf6vz'
];

var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};

var LOADING = {};

class MovieList extends Component {
	constructor(props){
	    super(props)
	    var ds = new ListView.DataSource({
	      rowHasChanged:(r1:r2) => r1 != r2,
	      sectionHeaderHasChanged:(r1:r2) => r1 != r2
	    })
	    this.state = {
	      dataSource:ds,
	      data:[{id:1,name:'飞天侠'},{id:2,name:'消费成'}],
	      filter:'',
	      isLoading: false,
      	  isLoadingTail: false,
      	  queryNumber: 1
	    }
	}
	Loading(){
		return this.state.isLoading;
	}
	componentDidMount() {
	    this.searchMovies('');
	}
	searchMovies(query: string){
		this.state.isLoading = true;
		this.timeoutID = null;
    	this.setState({filter: query});
   		var cachedResultsForQuery = resultsCache.dataForQuery[query];

   		LOADING[query] = true;
	    resultsCache.dataForQuery[query] = null;
	    this.setState({
	      isLoading: true,
	      queryNumber: this.state.queryNumber + 1,
	      isLoadingTail: false,
	    });

	    var fetchUrl=this._urlForQueryAndPage(query, 1);
	    fetch(fetchUrl)
	      .then((response) => {
	       var data = response.json();
	       return data;
	      })
	      .catch((error) => {
	        LOADING[query] = false;
	        resultsCache.dataForQuery[query] = undefined;
	        this.setState({
	          dataSource: this.getDataSource([]),
	          isLoading: false,
	        });
	      })
	      .then((responseData) => {
	        LOADING[query] = false;
	        resultsCache.totalForQuery[query] = responseData.total;
	        resultsCache.dataForQuery[query] = responseData.movies;
	        resultsCache.nextPageNumberForQuery[query] = 2;

	        if (this.state.filter !== query) {
	          // do not update state if the query is stale
	          return;
	        }

	        this.setState({
	          isLoading: false,
	          dataSource: this.getDataSource(responseData.movies),
	        });
	        this.state.isLoading = false;
	      })
	      .done();
	}
	_urlForQueryAndPage(query: string, pageNumber: number): string {
	    var apiKey = API_KEYS[this.state.queryNumber % API_KEYS.length];
	    if (query) {
	      return (
	        API_URL + 'movies.json?apikey=' + apiKey + '&q=' +
	        encodeURIComponent(query) + '&page_limit=20&page=' + pageNumber
	      );
	    } else {
	      // With no query, load latest movies
	      return (
	        API_URL + 'lists/movies/in_theaters.json?apikey=' + apiKey +
	        '&page_limit=20&page=' + pageNumber
	      );
	    }
	}
	selectMovie(movie: Object) {
	    this.props.navigator.push({
	      title: 'title',
	      component: MovieScreen,
	      passProps: {movie}
	    })
	}
	getDataSource(movies: Array<any>): ListView.DataSource {
	    return this.state.dataSource.cloneWithRows(movies);
	}
	_renderRow(
	    movie: Object,
	    sectionID: number | string,
	    rowID: number | string,
	    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
	  ) {
	    return (
	      <MovieCell
	        key={movie.id}
	        onSelect={() => this.selectMovie(movie)}
	        onHighlight={() => highlightRowFunc(sectionID, rowID)}
	        onUnhighlight={() => highlightRowFunc(null, null)}
	        movie={movie}/>
	    );
	}
	render(){
		var _listView:ListView;
		var content = this.state.dataSource.getRowCount() === 0 ?
		<ActivityIndicator
            animating={this.state.isLoading}
            style={{flex:1}}
            color="#00aa00"/>:
		<ListView
			ref={(listView) => _listView = listView}
			dataSource={this.state.dataSource}
			renderRow={this._renderRow.bind(this)}/>;
			return(
				<View style={styles.container}>
					<View style={styles.separator} />
			        {content}
			    </View>
			);
	}
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noMoviesText: {
    marginTop: 80,
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

module.exports = MovieList;