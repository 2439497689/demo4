
import React, { Component } from 'react';
import {  AppRegistry } from 'react-native';

var MainScreen = require('./MainScreen.js');

class demo4 extends Component {
  render() {
    return (
       <MainScreen />
    );
  }
}

AppRegistry.registerComponent('demo4', () => demo4);
