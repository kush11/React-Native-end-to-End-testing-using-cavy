import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import { NoFlickerImage } from 'react-native-no-flicker-image';
import { connect } from 'react-redux';
import AnimateNumber from 'react-native-animate-number';
import { hook } from 'cavy';
import WallpaperAnimation from '../../assets/animations/WallpaperAnimation';
import GetUserCountService from '../../api/StartPage/UsersCountService';
import {
  setAssessmentType, updateQuestions, updateCurrentQuestion,
  updateCurrentFlow, updateUsername, updateFetchedUrl, updateUserSocialImage
} from '../../store/actions/index';
import { fontMaker, regularButtonFont } from '../../components/utility/fonts/FontMaker';

import image1 from '../../assets/images/startPage/1.jpg';
import image2 from '../../assets/images/startPage/2.jpg';
import image3 from '../../assets/images/startPage/3.jpg';
import image4 from '../../assets/images/startPage/4.jpg';
import image5 from '../../assets/images/startPage/5.jpg';
import image6 from '../../assets/images/startPage/6.jpg';
import image7 from '../../assets/images/startPage/7.jpg';
import image8 from '../../assets/images/startPage/8.jpg';
import image9 from '../../assets/images/startPage/9.jpg';
import zulImage from '../../assets/images/onboard/zulNew.png';

const mapDispatchToProps = dispatch => ({
  getAllQuestion: data => dispatch(updateQuestions(data)),
  getCurrentQuestion: data => dispatch(updateCurrentQuestion(data)),
  SetAssessmentType: type => dispatch(setAssessmentType(type)),
  updateCurrentFlowProp: type => dispatch(updateCurrentFlow(type)),
  updatedUserName: name => dispatch(updateUsername(name)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url)),
  updatedUserSocialImage: uri => dispatch(updateUserSocialImage(uri))
});

class LandingComponent extends Component {
  wallpaperPaths = [
    { path: image1 },
    { path: image2 },
    { path: image3 },
    { path: image4 },
    { path: image5 },
    { path: image6 },
    { path: image7 },
    { path: image8 },
    { path: image9 }
  ];

  groupbuttons = [2, 0, 0, 8, 3];

  state = {
    imageURL: this.wallpaperPaths[0].path,
    UserCount: 0
  };

  componentWillMount() {
    this.UserCounter();
  }

  componentDidMount() {
    let i = 1;
    this.backInterval = setInterval(() => {
      this.setState({ imageURL: this.wallpaperPaths[i].path, });
      i = this.shouldCounterReset(i);
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.backInterval);
  }

  shouldCounterReset = (index) => {
    const p = index === 8 ? 0 : index + 1;
    return p;
  }

  UserCounter = () => {
    GetUserCountService.fetchUsersCount()
      .then((responseJson) => {
        try {
          this.setState({ UserCount: responseJson.totalCount });
        } catch (ex) {
          // console.error(ex);
        }
      })
      .catch(() => { });
  }

  changeCounter = () => {
    for (let i = 0; i < 8; i += 1) {
      this.groupbuttons[3] = i + 1;
      this.groupbuttons[4] = i + 2;
    }
  }

  render() {
    const { updateCurrentFlowProp, navigation, generateTestHook } = this.props;
    const { imageURL, UserCount } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <WallpaperAnimation>
          <NoFlickerImage style={styles.loginContainer} source={imageURL} />
        </WallpaperAnimation>
        <View style={styles.loginInnerContainer}>
          <View style={styles.logoContainer}>
            <Image style={styles.loginLogo} source={zulImage} />
            <Text style={{
              fontSize: 20, textAlign: 'center', color: '#fff', ...logoTextFontStyle
            }}
            >
              Re-Discover Yourself
            </Text>
          </View>

          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.statement}>We are helping</Text>
            <View style={{
              width: 100, height: 70, borderRadius: 25, backgroundColor: '#00000054', alignSelf: 'center', top: 3, flexDirection: 'row', justifyContent: 'center'
            }}
            >
              <Text style={{
                fontSize: 32, textAlign: 'center', color: '#fff', top: 15
              }}
              >
                <AnimateNumber
                  value={UserCount}
                  countBy={1}
                  timing={(interval, progress) => (
                    interval * (2 - Math.sin(Math.PI * progress)) * 10
                  )}
                />

              </Text>
            </View>
            <Text style={styles.statement}>
              people around the world to live
              <Text style={{ fontWeight: 'bold' }}> well</Text>
              {' '}
              and be
              <Text style={{ fontWeight: 'bold' }}> happy</Text>
            </Text>
          </View>
          <View style={{ width: '100%' }}>
            <TouchableOpacity style={styles.logInBtn} ref={generateTestHook('Action.LoginButton')} onPress={() => { updateCurrentFlowProp('NEW'); navigation.navigate('LogIn'); }}>

              <Text style={styles.textWhiteLogin}>{'Login to a better life'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%' }}>
            <Text style={{
              top: 12, fontSize: 16, fontFamily: 'System', color: '#ffffff', textAlign: 'center', ...statementFontStyle
            }}
            >
              In a hurry?
            </Text>
            <TouchableOpacity style={styles.takeAssessmentBtn} onPress={() => { updateCurrentFlowProp('NEW'); navigation.navigate('CheckYourWellness'); }}>
              <Text style={styles.textCheckYourWellness}>{'Check Your Wellness Now'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


const statementFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const logoTextFontStyle = fontMaker({ family: 'OpenSans', weight: 'Bold' });
const styles = StyleSheet.create({
  loginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  loginInnerContainer: {
    backgroundColor: '#00000054',
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  statement: {
    fontSize: 25,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 10,
    ...statementFontStyle
  },
  textCheckYourWellness: {
    color: '#ffffff',
    fontSize: 15,
    ...regularButtonFont
  },
  textWhiteLogin: {
    color: '#ffffff',
    fontSize: 18,
    ...regularButtonFont
  },
  takeAssessmentBtn: {
    backgroundColor: '#80399d',
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 15,
    borderRadius: 8,
    marginLeft: 30,
    marginRight: 30,
  },
  registerBtn: {
    backgroundColor: '#2980b9',
    alignItems: 'center',
    paddingVertical: 12,
    width: 130,
    borderRadius: 8,
    marginLeft: 5
  },
  logInBtn: {
    backgroundColor: '#27ae60',
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    marginLeft: 30,
    marginRight: 30,
    height: 60,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  loginLogo: {
    marginTop: 40,
    marginBottom: 5
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default connect(null, mapDispatchToProps)(hook(LandingComponent));
