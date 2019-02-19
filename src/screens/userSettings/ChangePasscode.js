import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, TextInput, Dimensions, TouchableOpacity, ImageBackground
} from 'react-native';
import { Text, Toast } from 'native-base';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { BASE_URL, headers } from '../../api/config/Config';
import { savePasscodeInfo } from '../../repository/login/LoginRepository';
import { fontMaker, regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';

const windowDimensions = Dimensions.get('window');

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile,
  currentFlow: state.Assessment.currentFlow
});

export class Passcode extends Component {
  state = {
    keyValues: {
      codeOne: '',
      codeTwo: '',
      codeThree: '',
      codeFour: '',
      codeFive: '',
      codeSix: '',
      codeSeven: '',
      codeEight: '',
      codeNine: '',
      codeTen: '',
      codeEleven: '',
      codeTwelve: '',
    },
    buttonDisable: true,
    showSCLAlert: false,
    alertTitle: ''
  }

  curFocInput = 1;

  setDataAndUpdateState = (curFocInputVal, text, firstProp, secondProp) => {
    const { keyValues } = this.state;
    if (!Number.isNaN(text)) {
      keyValues[firstProp] = text;
      if (text !== '' && secondProp !== '' && this.curFocInput !== 4 && this.curFocInput !== 8) {
        keyValues[secondProp] = '';
      }
      this.curFocInput = curFocInputVal;

      if (this.curFocInput > 0 && this.curFocInput !== 4 && this.curFocInput !== 8 && this.curFocInput < 12 && text !== '') {
        this.curFocInput += 1;
      }
      this.refs[this.curFocInput].focus();
    } else {
      keyValues[firstProp] = '';
    }
    this.setState({ keyValues });
    this.buttonDisable();
  }

  isEmptyString = str => str === '';


  buttonDisable = () => {
    const { keyValues } = this.state;
    setTimeout(() => {
      const hasEmpty = Object.values(keyValues)
        .slice(4, 12)
        .some(this.isEmptyString);
      if (!hasEmpty) {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  handleOpen = (title) => {
    this.setState({ showSCLAlert: true, alertTitle: title });
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false, alertTitle: '' });
  }


  submitPasscode = () => {
    const { keyValues } = this.state;
    const passcodeOne = keyValues.codeOne + keyValues.codeTwo
      + keyValues.codeThree + keyValues.codeFour;
    const passcodeTwo = keyValues.codeFive + keyValues.codeSix
      + keyValues.codeSeven + keyValues.codeEight;
    const passcodeThree = keyValues.codeNine + keyValues.codeTen
      + keyValues.codeEleven + keyValues.codeTwelve;

    const { name, navigation } = this.props;

    if (passcodeThree === passcodeTwo) {
      fetch(`${BASE_URL}/api/changePasscode`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          uName: name,
          passcode: passcodeOne,
          newPasscode: passcodeTwo
        })
      }).then(response => response.json())
        .then((response) => {
          Platform.OS === 'ios'
            ? Toast.show({
              text: response.message,
              duration: 2000,
              type: 'default',
              position: 'top'
            })
            : Toast.show({
              text: response.message,
              duration: 2000,
              type: 'default'
            });
          setTimeout(() => {
            response.valid === 'true' ? navigation.navigate('UserSetting') : null;
          }, 2000);
          savePasscodeInfo(passcodeTwo);
        })
        .catch(() => { });
    } else {
      this.handleOpen('Oops');
    }
  }

  generateInputs = (inputsData, startIndex) => inputsData.map((input, index) => {
    const { keyValues } = this.state;
    const value = keyValues[input.firstProp];
    return (
      <View style={{ flex: 1 }} key={input.firstProp}>
        <TextInput
          ref={startIndex + index + 1}
          underlineColorAndroid="#000"
          secureTextEntry
          placeholderTextColor="#000"
          keyboardType="numeric"
          value={value}
          style={styles.input}
          maxLength={1}
          onChangeText={
            (text) => {
              this.setDataAndUpdateState(startIndex + index + 1,
                text,
                input.firstProp,
                input.secondProp);
            }
          }
        />
      </View>
    );
  });

  render() {
    const { showSCLAlert, alertTitle, buttonDisable } = this.state;

    const inputsData = [
      { firstProp: 'codeOne', secondProp: 'codeTwo' },
      { firstProp: 'codeTwo', secondProp: 'codeThree' },
      { firstProp: 'codeThree', secondProp: 'codeFour' },
      { firstProp: 'codeFour', secondProp: 'codeFive' },
      { firstProp: 'codeFive', secondProp: 'codeSix' },
      { firstProp: 'codeSix', secondProp: 'codeSeven' },
      { firstProp: 'codeSeven', secondProp: 'codeEight' },
      { firstProp: 'codeEight', secondProp: 'codeNine' },
      { firstProp: 'codeNine', secondProp: 'codeTen' },
      { firstProp: 'codeTen', secondProp: 'codeEleven' },
      { firstProp: 'codeEleven', secondProp: 'codeTwelve' },
      { firstProp: 'codeTwelve', secondProp: '' }
    ];
    const inputsFirstRow = [...inputsData].slice(0, 4);
    const inputsSecondRow = [...inputsData].slice(4, 8);
    const inputsThirdRow = [...inputsData].slice(8, 12);

    return (
      <ImageBackground
        resizeMode="cover"
        style={{
          flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 0, height: windowDimensions.height, width: windowDimensions.width, position: 'absolute', backgroundColor: 'white', padding: 10
        }}
      >
        <SCLAlert
          theme="danger"
          show={showSCLAlert}
          title={alertTitle}
          subtitle="New Passcode and Confirm Passcode not matched!!!"
          onRequestClose={this.handleClose}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton
            theme="danger"
            onPress={this.handleClose}
            textStyle={{ ...regularButtonFont }}
          >
            CLOSE
          </SCLAlertButton>
        </SCLAlert>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          enableOnAndroid
        >

          <View>
            <Text style={{
              marginTop: 20, marginLeft: 5, color: 'black', fontSize: 16, ...titleFontStyle
            }}
            >
              Current Passcode
            </Text>
            <Text style={{
              marginLeft: 5, color: '#bbb', fontSize: 14, ...titleFontStyle
            }}
            >
              (Leave blank if never set previously)
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {this.generateInputs(inputsFirstRow, 0)}
            </View>
            <Text style={{
              marginTop: 10, marginLeft: 5, color: 'black', fontSize: 16, ...titleFontStyle
            }}
            >
              New Passcode
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {this.generateInputs(inputsSecondRow, 4)}
            </View>
            <Text style={{
              marginTop: 10, marginLeft: 5, color: 'black', fontSize: 16, ...titleFontStyle
            }}
            >
              Confirm New Passcode
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {this.generateInputs(inputsThirdRow, 8)}
            </View>
            <TouchableOpacity
              style={buttonDisable ? styles.disableBtn : styles.zulBtn}
              disabled={buttonDisable}
              onPress={() => this.submitPasscode()}
            >
              <Text style={styles.whiteText}>{'Submit'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const titleFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
  loginLogo: {
    marginTop: 60,
    marginBottom: 20
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: '#000',
    ...Platform.select({
      ios: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
      }
    }),
  },
  zulBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    marginRight: 80,
    marginLeft: 80
  },
  disableBtn: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    marginRight: 80,
    marginLeft: 80
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont
  },
  blackText: { color: '#000' },
  blackMatLayer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10
  }
});

export default connect(mapStateToProps, null)(Passcode);
