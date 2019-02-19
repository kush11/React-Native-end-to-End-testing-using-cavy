import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

export default class Profile extends Component {
  render() {
    const { data } = this.props;
    return (
      <View>
        <Text>Profile Page</Text>
        <View>
          <Text>{data}</Text>
        </View>
      </View>
    );
  }
}
