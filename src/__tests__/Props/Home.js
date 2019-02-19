
import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import Profile from './Profile';

export default class Home extends Component {
  state = { test: 'deom' }

  render() {
    const { test } = this.state;
    return (
      <View>
        <Text>Home Page</Text>
        <View>
          <Profile data={test} />
        </View>
      </View>
    );
  }
}
