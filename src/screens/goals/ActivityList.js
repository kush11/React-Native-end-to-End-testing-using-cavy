import React, { Component } from 'react';
import {
  View, StyleSheet, Text, Dimensions
} from 'react-native';
import { Card } from 'native-base';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Entypo';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class ActivityList extends Component {
  render() {
    return (
      <Card>
        <Text style={styles.activity}>{this.props.content}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', width: width, paddingVertical: 20, alignItems: 'center' }}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circle}>
                  <Icons name="check" size={20} color="white" />
                </View>
                <Text>────</Text>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 25, paddingLeft: 5 }}>
              <Text>M</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circle} />
                <Text>────</Text>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 25, paddingLeft: 5 }}>
              <Text>T</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circle} />
                <Text>────</Text>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 25, paddingLeft: 5 }}>
              <Text>W</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={[styles.circle, { backgroundColor: 'red' }]}>
                  <Icon name="cross" size={20} color="white" />
                </View>
                <Text>────</Text>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 25, paddingLeft: 5 }}>
              <Text>T</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={[styles.circle, { backgroundColor: 'red' }]} />
                <Text>────</Text>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 25, paddingLeft: 5 }}>
              <Text>F</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={[styles.circle, { backgroundColor: 'red' }]} />
                <Text>────</Text>
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 25, paddingLeft: 5 }}>
              <Text>S</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 7 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={[styles.circle, { backgroundColor: 'red' }]} />
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 25, paddingLeft: 5 }}>
              <Text>S</Text>
            </View>
          </View>
        </View>
      </Card>
    );
  }
}

const valueFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 22 / 2,
    backgroundColor: '#41ab3e',
    justifyContent: 'center',
    alignItems: 'center'
  },
  activity: {
    fontSize: 20,
    color: 'grey',
    // alignSelf: 'center',
    ...valueFontStyle
  }
});

export default ActivityList;
