import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, TextInput, TouchableOpacity
} from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import SmsListener from 'react-native-android-sms-listener';
import { BASE_URL, headers } from '../../api/config/Config';
import { regularButtonFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  name: state.User.name,
  mobile: state.User.mobile
});
class OTP extends Component {
  state = {
    digitOne: '',
    digitTwo: '',
    digitThree: '',
    digitFour: '',
    buttonDisable: true,
    displaySendOTP: false,
    reqOTP: '',
  };

  // curFocInput = 1;
  subscription = SmsListener.addListener(async (message) => {
    const verificationCodeRegex = /ZingUpLife is: ([\d]{4})/;
    // console.log('subscription:', subscription);
    if (verificationCodeRegex.test(message.body)) {
      const Code = message.body.match(verificationCodeRegex)[1];
      // console.log('verificationCode:', verificationCode);
      await this.setState({
        digitOne: Code[0],
        digitTwo: Code[1],
        digitThree: Code[2],
        digitFour: Code[3],
        buttonDisable: false
      });
    }
    setTimeout(() => {
      this.submitOTP(this.props);
    }, 10000);
  });

  componentDidMount() {
    this.sendOTP();
    setTimeout(() => {
      this.setState({ displaySendOTP: true });
    }, 10000);
  }

  componentWillUnmount() {
    const subscription = SmsListener.addListener(() => {
      subscription.remove();
    });
  }

  // autoFillOtp = () => {
  //   const { verificationCode } = this.state;
  //   this.setState({
  //     digitOne: verificationCode[0],
  //     digitTwo: verificationCode[1],
  //     digitThree: verificationCode[2],
  //     digitFour: verificationCode[3],
  //   });
  // }

  sendOTP = () => {
    const { mobile } = this.props;
    fetch(`${BASE_URL}/api/otp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ mobile })
    }).then(response => response.json())
      .then((responseJson) => { this.setState({ reqOTP: responseJson.resOtp }); });
  }

  goToNextTextInput = (text, node, focusPoint) => {
    switch (node) {
      case 'One': this.setState({ digitOne: text });
        //  this.curFocInput = 1;
        if (text !== '') {
          this.setState({ digitTwo: '' });
        }
        break;
      case 'Two': this.setState({ digitTwo: text });
        //  this.curFocInput = 2;
        if (text !== '') {
          this.setState({ digitThree: '' });
        }
        break;
      case 'Three': this.setState({ digitThree: text });
        //  this.curFocInput = 3;
        if (text !== '') {
          this.setState({ digitFour: '' });
        }
        break;
      case 'Four': this.setState({ digitFour: text });
        //  this.curFocInput = 4;
        break;
      default:
        break;
    }


    // if (this.curFocInput > 0 && this.curFocInput < 4 && text !== '') {
    //   this.curFocInput += 1;
    // }
    if (text !== '') {
      focusPoint.focus();
    }
  }

  ButtonDisable = () => {
    // const {
    //   digitOne, digitTwo, digitThree, digitFour
    // } = this.state;
    setTimeout(() => {
      if (this.state.digitOne !== '' && this.state.digitTwo !== '' && this.state.digitThree !== '' && this.state.digitFour !== '') {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }


  submitOTP = (props) => {
    const {
      digitOne, digitTwo, digitThree, digitFour, reqOTP
    } = this.state;
    const { showAlert } = this.props;
    const inputOTP = digitOne + digitTwo + digitThree + digitFour;
    if (reqOTP === inputOTP) {
      props.nextHandler();
    } else {
      showAlert('Oops!', 'Please enter valid OTP', 'danger', 'Close');
    }
  }


  render() {
    const {
      digitOne, digitTwo, digitThree, digitFour, displaySendOTP, buttonDisable,
    } = this.state;
    return (
      <View style={styles.container}>
        <Text style={{
          marginLeft: 5, color: '#ffffff', fontSize: 20, marginBottom: 10
        }}
        >
          One time password(OTP)
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <TextInput
              // ref="1"
              ref={(foc) => { this.r1 = foc; }}
              underlineColorAndroid="#fff"
              secureTextEntry
              placeholderTextColor="#fff"
              value={digitOne}
              keyboardType="numeric"
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'One', this.r2); this.ButtonDisable(); } else { this.setState({ digitOne: '' }); }
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
              value={digitTwo}
              keyboardType="numeric"
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Two', this.r3); this.ButtonDisable(); } else { this.setState({ digitTwo: '' }); }
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
              value={digitThree}
              keyboardType="numeric"
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Three', this.r4); this.ButtonDisable(); } else { this.setState({ digitThree: '' }); }
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
              value={digitFour}
              keyboardType="numeric"
              style={styles.input}
              maxLength={1}
              onChangeText={(text) => {
                if (!Number.isNaN(text)) { this.goToNextTextInput(text, 'Four', this.r4); this.ButtonDisable(); } else { this.setState({ digitFour: '' }); }
              }}
            />
          </View>
        </View>
        {/* <Text>
          Code is
          {verificationCode}
        </Text> */}
        <TouchableOpacity onPress={() => this.sendOTP()}>
          {displaySendOTP
            ? (
              <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
                <Icon
                  name="repeat"
                  style={{
                    fontSize: 13, color: '#ffffff', marginVertical: 19, ...regularButtonFont
                  }}
                  size={10}
                />
                <Text style={{
                  marginLeft: 3, marginVertical: 10, padding: 5, textAlign: 'center', color: '#ffffff', ...regularButtonFont, flexDirection: 'column'
                }}
                >
                  Resend OTP
                </Text>
              </View>
            ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={buttonDisable ? styles.disableBtn : styles.zulBtn}
          disabled={buttonDisable}
          onPress={() => this.submitOTP(this.props)}
        >
          <Text style={styles.whiteText}>{'Submit OTP'.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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
    marginTop: 40,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
    ...regularButtonFont
  },
  disableBtn: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 40,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60,
    ...regularButtonFont
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont
  },
  blackText: {
    color: '#000',
    ...regularButtonFont
  }

});

export default connect(mapStateToProps)(OTP);
