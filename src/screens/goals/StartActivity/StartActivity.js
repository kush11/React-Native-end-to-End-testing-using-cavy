import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CountdownCircle from 'react-native-countdown-circle';

class StartActivity extends Component {

  state = { count: 3 }

  constructor(props: Object) {
    super(props);
    this.state = { timer: 0 };
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  call = () => {
    this.setState({ timer: 1 });
  }


  render() {
    const { timer } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Play Badminton</Text>
        <TouchableOpacity onPress={this.call}>
          <Icon style={styles.icon} name="play" size={20} color="grey" />
        </TouchableOpacity>
        <Text style={styles.text}>Start Workout</Text>
        {timer === 1
          ? <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
            <CountdownCircle
              seconds={3}
              radius={30}
              borderWidth={8}
              color="#ff003f"
              bgColor="#fff"
              textStyle={{ fontSize: 20 }}
              onTimeElapsed={() => console.log('Elapsed!')}
            />
          </View> : null
        }

        <Text style={styles.text}>Timer</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  text: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
    justifyContent: 'center'
  }

});

export default StartActivity;
