import React from 'react';
import {
  Platform, View, Text, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { Header, Left, Right } from 'native-base';

const mapStateToProps = state => ({
  currentAssessment: state.Assessment.currentAssessment,
  totalReward: 0
});

const questionHeader = ({ currentAssessment }) => (
  <View>
    {(Platform.OS === 'ios')
      ? (
        <Header style={{ backgroundColor: 'white' }}>
          <Left>
            <Text style={styles.headerIos}>{currentAssessment}</Text>
          </Left>
          <Right />
        </Header>
      )
      : (
        <Header style={{ backgroundColor: 'white' }}>
          <Left>
            <Text style={styles.header}>{currentAssessment}</Text>
          </Left>
          <Right />
        </Header>
      )
    }
  </View>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 350,
    color: '#144E76'
  },
  headerIos: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 350,
    color: '#144E76'
  },
});

export default connect(mapStateToProps)(questionHeader);
