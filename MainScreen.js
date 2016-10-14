
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity
} from 'react-native';
var MovieList = require('./MovieList.js');
var RouteMapper = function(route, navigator) {
   return <route.component navigator={navigator}  {...route.passProps} />;
};

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if (index > 0) {
      return (
        <View style={styles.navContainer}>
          <TouchableOpacity
            underlayColor='transparent'
            onPress={() => {if (index > 0) {navigator.pop()}}}>
            <Text style={styles.leftNavButtonText}>
              后退
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  },
  RightButton(route, navigator, index, navState) {
  },
  Title(route, navigator, index, navState) {
    return (
      <View>
        <View style={styles.navContainer}>
          <Text style={styles.headText}>
                电影列表API实例
          </Text>
        </View>
      </View>
    );
  }
}
class MainScreen extends Component {
  render() {
    return (
      <Navigator 
        style={{flex:1,paddingTop: 60}}
        initialRoute={{name: 'search',component: MovieList}}
        configureScene={() => Navigator.SceneConfigs.PushFromRight}
        renderScene={RouteMapper}
        navigationBar={
          <Navigator.NavigationBar
            style={styles.navContainer}
            routeMapper={NavigationBarRouteMapper}/>}/>
    );
  }
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: '#528e49',
    paddingTop: 5,
  },
  headText: {
    color: '#fff',
    fontSize: 22
  },
  leftNavButtonText: {
    color: '#ffffff',
    fontSize: 15,
    marginLeft: 13,
    paddingTop: 7,
  }
});

module.exports = MainScreen;
