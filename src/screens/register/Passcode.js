import React, { Component } from 'react';
import {
  AsyncStorage, Platform, View, StyleSheet, TextInput, TouchableOpacity, Alert
} from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import { saveLoginInfo } from '../../repository/login/LoginRepository';
import { BASE_URL, headers } from '../../api/config/Config';
import {
  updateUsername, updateDob, updateHeight, updateWeight
} from '../../store/actions/index';
import { regularButtonFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile,
  email: state.User.email,
  dob: state.User.dob,
  gender: state.User.gender,
  inviteCode: state.User.inviteCode,
  currentFlow: state.Assessment.currentFlow,
  assessmentId: state.Assessment.assessmentId,
  tempHeight: state.User.tempheight,
  tempWeight: state.User.tempweight,
  tempDob: state.User.tempDob,
  image: state.User.socialImage
});
const mapDispatchToProps = dispatch => ({
  updateName: name => dispatch(updateUsername(name)),
  updatedDob: dob => dispatch(updateDob(dob)),
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedWeight: weight => dispatch(updateWeight(weight)),
});

class Passcode extends Component {
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
    switch (node) {
      case 'One': this.setState({ codeOne: text });
        if (text !== '') {
          this.setState({ codeTwo: '' });
        }
        // this.curFocInput = 1;
        break;
      case 'Two': this.setState({ codeTwo: text });
        if (text !== '') {
          this.setState({ codeThree: '' });
        }
        // this.curFocInput = 2;
        break;
      case 'Three': this.setState({ codeThree: text });
        if (text !== '') {
          this.setState({ codeFour: '' });
        }
        // this.curFocInput = 3;
        break;
      case 'Four': this.setState({ codeFour: text });
        // this.curFocInput = 4;
        break;
      case 'Five': this.setState({ codeFive: text });
        // this.curFocInput = 5;
        if (text !== '') {
          this.setState({ codeSix: '' });
        }
        break;
      case 'Six': this.setState({ codeSix: text });
        if (text !== '') {
          this.setState({ codeSeven: '' });
        }
        // this.curFocInput = 6;
        break;
      case 'Seven': this.setState({ codeSeven: text });
        if (text !== '') {
          this.setState({ codeEight: '' });
        }
        // this.curFocInput = 7;
        break;
      case 'Eight': this.setState({ codeEight: text });
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

  buttonDisable = () => {
    // const {
    //   codeOne, codeTwo, codeThree,
    //   codeFour, codeFive, codeSix,
    //   codeSeven, codeEight
    // } = this.state;
    setTimeout(() => {
      if (this.state.codeOne !== '' && this.state.codeTwo !== '' && this.state.codeThree !== ''
        && this.state.codeFour !== '' && this.state.codeFive !== '' && this.state.codeSix !== ''
        && this.state.codeSeven !== '' && this.state.codeEight !== '') {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  // map answers to user
  mapAnswerToUser = () => {
    const { assessmentId, name, dob } = this.props;
    const obj = {
      id: assessmentId,
      userName: name,
      dob: dob ? moment(dob).format('MM-DD-YYYY') : null
    };
    fetch(`${BASE_URL}/api/mapAnswerToUser`, {
      method: 'POST',
      headers,
      body: JSON.stringify(obj)
    }).then(response => response.json())
      .then(() => {
        // console.log('User Mapped to Wholesomeness Assessment', responseJson);
      })
      .catch(() => {
        // console.error(error);
      });
  }

  submitPasscode = (props) => {
    const {
      codeOne, codeTwo, codeThree,
      codeFour, codeFive, codeSix,
      codeSeven, codeEight
    } = this.state;
    const {
      name, mobile, email, tempDob, tempHeight, tempWeight, inviteCode,
      showAlert, updateName, currentFlow, updatedDob, updatedHeight, updatedWeight
    } = this.props;
    const passcodeOne = codeOne + codeTwo + codeThree + codeFour;
    const passcodeTwo = codeFive + codeSix + codeSeven + codeEight;
    let InviteCode = inviteCode;
    if (InviteCode !== '') {
      InviteCode = inviteCode.trim();
    }
    if (passcodeOne === passcodeTwo) {
      fetch(`${BASE_URL}/api/user`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          mobile,
          email: email === '' ? `demo${name}` : email,
          passcode: passcodeOne,
          dob: tempDob !== '' && tempDob ? moment(tempDob).format('MM-DD-YYYY') : null,
          height: tempHeight,
          weight: tempWeight,
          inviteCode: InviteCode
        })
      }).then(response => response.json())
        .then((responseJson) => {
          // console.log(responseJson);
          if (responseJson.code === 11000) {
            showAlert('Oops!', 'User already registered in ZUL system', 'danger', 'Close');
          }
          if (responseJson.status === 'Invalid invite code') {
            showAlert('Oops!', 'Enter valid Invite code', 'danger', 'Close');
          } else {
            updateName(responseJson.name);
            updatedDob(responseJson.dob);
            updatedHeight(responseJson.height);
            updatedWeight(responseJson.weight);
            if (currentFlow === 'UNREGISTERED') {
              this.mapAnswerToUser();
            }
            const userinfo = {};
            userinfo.reportsNavigation = props.reportsNavigation;
            userinfo.loginNavigation = props.loginNavigation;
            userinfo.currentFlow = props.currentFlow;
            userinfo.passcode = passcodeOne;
            userinfo.name = name;
            userinfo.identityProvider = 'ZUL';

            Alert.alert(
              'Enable Touch Id',
              'Do you want to enable touch id?',
              [
                {
                  text: 'NO',
                  onPress: () => {
                    userinfo.enableTouchId = 'false';
                    this.completeRegisteration(userinfo);
                  },
                  style: 'cancel'
                },
                {
                  text: 'YES',
                  onPress: () => {
                    userinfo.enableTouchId = 'true';
                    this.completeRegisteration(userinfo);
                  }
                },
              ],
              { cancelable: false }
            );
          }
        });
    } else {
      showAlert('Oops!', 'Passcode not matched!!!', 'danger', 'Close');
    }
  }

  completeRegisteration = async (userinfo) => {
    // TODO: remove the hotfix for a sustainable solution
    const { showAlert } = this.props;
    AsyncStorage.setItem('enableTouchId', userinfo.enableTouchId); // hotfix #1164
    saveLoginInfo(userinfo);
    showAlert('Congratulations!', 'You are now a Zinger!\nYour wellness journey begins.', 'success', 'Let\'s Go');
  }


  render() {
    const {
      codeOne, codeTwo, codeThree,
      codeFour, codeFive, codeSix,
      codeSeven, codeEight, buttonDisable
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={{
          marginLeft: 5, color: '#ffffff', fontSize: 20, marginBottom: 10
        }}
        >
          Passcode:
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
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'One', this.r2); this.buttonDisable(); } else { this.setState({ codeOne: '' }); }
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
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Two', this.r3); this.buttonDisable(); } else { this.setState({ codeTwo: '' }); }
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
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Three', this.r4); this.buttonDisable(); } else { this.setState({ codeThree: '' }); }
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
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Four', this.r4); this.buttonDisable(); } else { this.setState({ codeFour: '' }); }
              }}
            />
          </View>
        </View>
        <Text style={{
          marginLeft: 5, color: '#ffffff', marginTop: 20, fontSize: 20, marginBottom: 10
        }}
        >
          Re-enter Passcode:
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
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Five', this.r6); this.buttonDisable(); } else { this.setState({ codeFive: '' }); }
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
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Six', this.r7); this.buttonDisable(); } else { this.setState({ codeSix: '' }); }
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
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Seven', this.r8); this.buttonDisable(); } else { this.setState({ codeSeven: '' }); }
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
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Eight', this.r8); this.buttonDisable(); } else { this.setState({ codeEight: '' }); }
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={buttonDisable ? styles.disableBtn : styles.zulBtn}
          disabled={buttonDisable}
          onPress={() => this.submitPasscode(this.props)}
        >
          <Text style={styles.whiteText}>{"Let's Go".toUpperCase()}</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Passcode);
const styles = StyleSheet.create({
  container: { marginTop: 60 },
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
  whiteText: {
    color: '#fff',
    ...regularButtonFont
  },
  blackText: { color: '#000' },
  alertContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555555',
    fontWeight: '300'
  }

});
