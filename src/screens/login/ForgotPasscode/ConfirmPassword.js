import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, TextInput, TouchableOpacity
} from 'react-native';
import { Text, Toast } from 'native-base';
import { connect } from 'react-redux';
import { BASE_URL, headers } from '../../../api/config/Config';
import { regularButtonFont } from '../../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile,
  currentFlow: state.Assessment.currentFlow
});
class ForgotPasscode extends Component {
  state = {
    codeOne: '',
    codeTwo: '',
    codeThree: '',
    codeFour: '',
    codeFive: '',
    codeSix: '',
    codeSeven: '',
    codeEight: '',
    buttonDisable: true
  }

  // curFocInput = 1;

  goToNextTextInput = (text, node, focusPoint) => {
    const ob = {};
    ob[`code${node}`] = text;
    this.setState(ob);
    switch (node) {
      case 'One':
        if (text !== '') {
          this.setState({ codeTwo: '' });
        }
        // this.curFocInput = 1;
        break;
      case 'Two':
        if (text !== '') {
          this.setState({ codeThree: '' });
        }
        // this.curFocInput = 2;
        break;
      case 'Three':
        if (text !== '') {
          this.setState({ codeFour: '' });
        }
        // this.curFocInput = 3;
        break;
      case 'Four':
        // this.curFocInput = 4;
        break;
      case 'Five':
        // this.curFocInput = 5;
        if (text !== '') {
          this.setState({ codeSix: '' });
        }
        break;
      case 'Six':
        if (text !== '') {
          this.setState({ codeSeven: '' });
        }
        // this.curFocInput = 6;
        break;
      case 'Seven':
        if (text !== '') {
          this.setState({ codeEight: '' });
        }
        // this.curFocInput = 7;
        break;
      case 'Eight':
        // this.curFocInput = 8;
        break;
      default:
        break;
    }
    // if (this.curFocInput > 0 && this.curFocInput !== 4 && this.curFocInput < 8 && text !== '') {
    //   this.curFocInput += 1;
    // }
    // this.refs[this.curFocInput].focus();

    if (text !== '') {
      focusPoint.focus();
    }
  }

  disableButton = () => {
    // const {
    //   codeOne, codeTwo, codeThree,
    //   codeFour, codeFive, codeSix,
    //   codeSeven, codeEight
    // } = this.state;
    setTimeout(() => {
      if (this.state.codeOne !== '' && this.state.codeTwo !== '' && this.state.codeThree !== '' && this.state.codeFour !== '' && this.state.codeFive !== '' && this.state.codeSix !== '' && this.state.codeSeven !== '' && this.state.codeEight !== '') {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  submitPasscode = (props) => {
    const {
      codeOne, codeTwo, codeThree,
      codeFour, codeFive, codeSix,
      codeSeven, codeEight
    } = this.state;
    const { mobile } = this.props;
    const passcodeOne = codeOne + codeTwo + codeThree + codeFour;
    const passcodeTwo = codeFive + codeSix + codeSeven + codeEight;
    if (passcodeOne === passcodeTwo) {
      fetch(`${BASE_URL}/api/passcode`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mobile,
          passcode: passcodeOne
        })
      }).then((response) => {
        response.json();
        Platform.OS === 'ios'
          ? Toast.show({
            text: 'Passcode Changed Successfully',
            duration: 2000,
            type: 'default',
            position: 'top'
          })
          : Toast.show({
            text: 'Passcode Changed Successfully',
            duration: 2000,
            type: 'default'
          });
        setTimeout(() => {
          props.goToLogin();
        }, 2000);
      })
        .catch(() => {
          Platform.OS === 'ios'
            ? Toast.show({
              text: 'Passcode has not changed',
              duration: 2000,
              type: 'default',
              position: 'top'
            })
            : Toast.show({
              text: 'Passcode has not changed',
              duration: 2000,
              type: 'default'
            });
          // console.error(error);
        });
    } else {
      Platform.OS === 'ios'
        ? Toast.show({
          text: 'Passcode not matched',
          duration: 2000,
          type: 'default',
          position: 'top'
        })
        : Toast.show({
          text: 'Passcode not matched',
          duration: 2000,
          type: 'default'
        });
    }
  }

  render() {
    const {
      codeOne, codeTwo, codeThree,
      codeFour, codeFive, codeSix,
      codeSeven, codeEight, buttonDisable
    } = this.state;
    return (
      <View>
        <Text style={{
          marginLeft: 5, marginTop: 10, color: '#ffffff', fontSize: 20
        }}
        >
          New Passcode:
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="1"
              ref={(foc) => { this.r1 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={codeOne}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'One', this.r2); this.disableButton(); } else { this.setState({ codeOne: '' }); }
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="2"
              ref={(foc) => { this.r2 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={codeTwo}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Two', this.r3); this.disableButton(); } else { this.setState({ codeTwo: '' }); }
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="3"
              ref={(foc) => { this.r3 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={codeThree}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Three', this.r4); this.disableButton(); } else { this.setState({ codeThree: '' }); }
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="4"
              ref={(foc) => { this.r4 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={codeFour}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Four', this.r4); this.disableButton(); } else { this.setState({ codeFour: '' }); }
              }}
            />
          </View>
        </View>
        <Text style={{
          marginLeft: 5, color: '#ffffff', marginTop: 10, fontSize: 20
        }}
        >
          Confirm New Passcode:
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="5"
              ref={(foc) => { this.r5 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={codeFive}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Five', this.r6); this.disableButton(); } else { this.setState({ codeFive: '' }); }
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="6"
              ref={(foc) => { this.r6 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={codeSix}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Six', this.r7); this.disableButton(); } else { this.setState({ codeSix: '' }); }
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="7"
              ref={(foc) => { this.r7 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={codeSeven}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Seven', this.r8); this.disableButton(); } else { this.setState({ codeSeven: '' }); }
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="8"
              ref={(foc) => { this.r8 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              keyboardType="numeric"
              value={codeEight}
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Eight', this.r8); this.disableButton(); } else { this.setState({ codeEight: '' }); }
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={buttonDisable ? styles.disableBtn : styles.zulBtn}
          disabled={buttonDisable}
          onPress={() => this.submitPasscode(this.props)}
        >
          <Text style={styles.whiteText}>{'Change Passcode'.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

    );
  }
}
export default connect(mapStateToProps, null)(ForgotPasscode);
const styles = StyleSheet.create({
  loginLogo: {
    height: 150,
    width: 150
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: '#fff',
    ...Platform.select({
      ios: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
      }
    }),
  },
  zulBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  disableBtn: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  whiteText: { color: '#fff', ...regularButtonFont },
  blackText: { color: '#000' },
  blackMatLayer: {
    backgroundColor: '#00000054',
    position: 'absolute',
    top: 20,
    bottom: 40,
    left: 10,
    right: 10
  }

});
