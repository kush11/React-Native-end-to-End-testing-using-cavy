import React, { Component } from 'react';
import {
  StyleSheet, Keyboard, ImageBackground, Dimensions
} from 'react-native';
import { View } from 'native-base';
import { connect } from 'react-redux';
// import AwesomeAlert from 'react-native-awesome-alerts';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import Form from './Form';
import { updateCurrentFlow } from '../../store/actions/assessment';

const windowDimensions = Dimensions.get('window');

const mapStateToProps = state => ({
  currentFlow: state.Assessment.currentFlow,
  tempHeight: state.User.tempheight,
  currentAssessment: state.Assessment.currentAssessment,
  image: state.User.socialImage
});

const mapDispatchToProps = dispatch => ({ updateUserCurrentFlow: flow => dispatch(updateCurrentFlow(flow)) });

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isKeyboardOpened: false,
      showAlert: false,
      title: '',
      description: '',
      buttonMessage: 'LET\'S GO'
      // showConfirm: false,
      // showProgress: false,
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpened: true });
  }

  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpened: false });
  }

  showAlert = (title, desc) => {
    this.setState({
      showAlert: true,
      title,
      description: desc,
      // showConfirm,
      // showProgress
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      title: '',
      description: ''
    });
    this.goToFunction();
  };

  goToFunction = () => {
    const { currentFlow, updateUserCurrentFlow } = this.props;
    if (currentFlow === 'UNREGISTERED') {
      this.reportsNavigation();
    } else {
      this.goHome();
    }
    updateUserCurrentFlow('REGISTERED');
  }

  goHome = () => {
    const { navigation, updateUserCurrentFlow } = this.props;
    navigation.navigate('OverviewRoute');
    updateUserCurrentFlow('REGISTERED');
  }

  goRegister = () => {
    const { navigation } = this.props;
    navigation.navigate('Register');
  }

  goForgotPassword = () => {
    const { navigation } = this.props;
    navigation.navigate('ForgotPassword');
  }

  goToDashboard = () => {
    const { navigation } = this.props;
    navigation.navigate('MainApp');
  }

  reportsNavigation = () => {
    const { navigation, currentAssessment } = this.props;
    if (currentAssessment === 'Biological Age') {
      navigation.navigate('BiologicalReport');
    } else {
      navigation.navigate('AssessmentReport');
    }
  }

  render() {
    const {
      showAlert, title, description, isKeyboardOpened, buttonMessage
    } = this.state;
    /* eslint-disable global-require */
    const src = require('../../assets/images/loginwallpapers/loginBackground.jpg');
    /* eslint-enable global-require */
    return (
      <ImageBackground
        source={src}
        resizeMode="cover"
        style={{
          flex: 1, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute'
        }}
      >
        <View style={styles.blackMatLayer}>
          <Form
            isKeyboardOpen={isKeyboardOpened}
            showAlert={this.showAlert}
            goHome={this.goHome}
            goRegister={this.goRegister}
            goForgotPassword={this.goForgotPassword}
            goToDashboard={this.goToDashboard}
            reportsNavigation={this.reportsNavigation}
          />
        </View>
        {/* <AwesomeAlert
          alertContainerStyle={{ width: '100%', height: 600 }}
          messageStyle={{ fontSize: 15, color: '#3a3a3a' }}
          confirmButtonTextStyle={{ fontSize: 16, paddingVertical: 5, textAlign: 'center' }}
          confirmButtonStyle={{ width: 200 }}
          show={showAlert}
          showProgress={showProgress}
          title={title}
          message={description}
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={showConfirm}
          cancelText=""
          confirmText="Continue"
          confirmButtonColor="#00c497"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
            this.goHome();
          }}
        /> */}
        <SCLAlert
          theme="success"
          show={showAlert}
          title={title}
          subtitle={description}
          cancellable
          onRequestClose={() => {
            this.hideAlert();
          }}
        // titleStyle={{ ...defaultModalFont }}
        // subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton
            theme="success"
            onPress={() => {
              this.hideAlert();
            }}
          // textStyle={{ ...regularButtonFont }}
          >
            {buttonMessage.toUpperCase()}
          </SCLAlertButton>
        </SCLAlert>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  loginInnerContainer: {
    flex: 1,
    padding: 20
  },
  blackMatLayer: {
    backgroundColor: '#00000054',
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
