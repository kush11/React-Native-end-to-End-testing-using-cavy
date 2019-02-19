import React, { Component } from 'react';
import {
  StyleSheet, View, Image, Dimensions, AsyncStorage, Animated, TouchableOpacity, ScrollView
} from 'react-native';
import { Text, Toast } from 'native-base';
import { connect } from 'react-redux';
import { hook } from 'cavy';
import AutoLogin from '../../../api/StartPage/AutoLogin';
import {
  updateUsername, updateUserSocialImage, updateDob, updateEmail, updateFetchedUrl,
  updateHeight, updateWeight
} from '../../../store/actions/users';
import { updateCurrentFlow } from '../../../store/actions/assessment';
import { regularButtonFont } from '../../utility/fonts/FontMaker';

const mapDispatchToProps = dispatch => ({
  updatedUsername: name => dispatch(updateUsername(name)),
  updatedCurrentFlow: flow => dispatch(updateCurrentFlow(flow)),
  updatedUserSocialImage: image => dispatch(updateUserSocialImage(image)),
  updatedDob: dob => dispatch(updateDob(dob)),
  updatedEmail: email => dispatch(updateEmail(email)),
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedWeight: weight => dispatch(updateWeight(weight)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url))
});

class PreOnBoard extends Component {
  state = {
    autoLogin: false,
    spinValue: new Animated.Value(0)
  }

  componentWillMount() {
    AsyncStorage.getItem('isFirstTimeUser', (err, result) => {
      if (result === 'false') {
        this.setState({ autoLogin: true });
        this.autologin();
      } else {
        this.setState({ autoLogin: false });
      }
    });
  }

  componentDidMount() {
    const { spinValue } = this.state;
    Animated.sequence([
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            spinValue,
            {
              toValue: 1,
              duration: 20000
            }
          ),
          Animated.timing(
            spinValue,
            {
              toValue: 0,
              duration: 20000
            }
          )
        ])
      )
    ]).start();
  }

  _done = () => {
    const { navigation } = this.props;
    AsyncStorage.setItem('isFirstTimeUser', 'false', () => {
      navigation.navigate('LoginRoute');
    });
  }

  autologin = () => {
    const {
      navigation, updatedUsername, updatedDob, updatedHeight, updatedWeight,
      updatedUserSocialImage, updatedCurrentFlow, updatedFetchedUrl
    } = this.props;
    updatedCurrentFlow('REGISTERED');
    AsyncStorage.getItem('userToken').then((token) => {
      AutoLogin.autoLogin(token).then((responseJson) => {
        try {
          if (responseJson.name === 'JsonWebTokenError') {
            this._done();
          } else {
            updatedUsername(responseJson.name);
            updatedDob(responseJson.dob);
            updatedHeight(responseJson.height);
            updatedWeight(responseJson.weight);
            updatedFetchedUrl(responseJson.image.userImageURL);
            AsyncStorage.getItem('UserSocialImage').then((socialImage) => {
              updatedUserSocialImage(socialImage);
            });
            navigation.navigate('OverviewRoute');
          }
        } catch (ex) {
          Toast.show({
            text: ex,
            duration: 2000,
            type: 'danger'
          });
        }
      }).catch((error) => {
        Toast.show({
          text: error,
          duration: 2000,
          type: 'danger'
        });
      });
    });
  }

  render() {
    const { spinValue, autoLogin } = this.state;
    const { navigation, generateTestHook } = this.props;
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (
      /* eslint-disable global-require */
      <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.sliderContainer}>
          <Text style={{ fontSize: 22, textAlign: 'center', color: '#000' }}>Welcome To</Text>
          <Image style={styles.loginLogo} source={require('../../../assets/images/onboard/zulNew.png')} />
          <Text style={{ fontSize: 22, textAlign: 'center', color: '#000' }}>Re-Discover Yourself</Text>
          <View
            style={{
              display: 'flex',
              height: Dimensions.get('window').width,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <Image
              style={{
                alignSelf: 'center',
                position: 'absolute'
              }}
              source={require('../../../assets/images/onboard/zulsmalllogo.png')}
            />
            <Animated.Image
              style={{
                transform: [{ rotate: spin }],
                marginBottom: -80,
                height: Dimensions.get('window').width,
                width: Dimensions.get('window').width,
              }}
              source={require('../../../assets/images/onboard/dimension.png')}
            /* eslint-enable global-require */
            />
          </View>
          {autoLogin
            ? null
            : ( //  navigation.navigate('OnBoard');  // changed from the on press to _done()
              <TouchableOpacity style={styles.logInBtn} ref={generateTestHook('Action.PreOnBoardButton')} onPress={() => { this._done(); }}>
                <Text style={{ color: '#fff', ...regularButtonFont }}>{'Continue'.toUpperCase()}</Text>
              </TouchableOpacity>
            )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  sliderContainer: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginLogo: {
    marginTop: 10,
    marginBottom: 20
  },

  Logo: {
    // height: 500,
    marginBottom: -80,
    // width: 350
  },
  text: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: -50,
    padding: 10
  },
  logInBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 12,
    width: 130,
    borderRadius: 8,
    marginBottom: 20,
  },
});


export default connect(null, mapDispatchToProps)(hook(PreOnBoard));
