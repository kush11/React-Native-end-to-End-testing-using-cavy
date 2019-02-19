import React from 'react';
import {
  Platform, View, StyleSheet, TouchableOpacity
} from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import FloatingLabel from '../../components/ui/floatingLabel/floatingLabel';
import {
  updateUsername, updateMobile, updateEmail, updateOtp, updateInviteCode,
  updateDob, updateUserSocialImage, updateHeight, updateWeight
} from '../../store/actions/index';
import { BASE_URL, headers } from '../../api/config/Config';
import { regularButtonFont } from '../../components/utility/fonts/FontMaker';


const mapStateToProps = state => ({
  currentFlow: state.Assessment.currentFlow,
  uname: state.User.name,
  uDob: state.User.dob,
  image: state.User.socialImage
});
const mapDispatchToProps = dispatch => ({
  updateName: name => dispatch(updateUsername(name)),
  updateUserMobile: mobile => dispatch(updateMobile(mobile)),
  updateUserEmail: email => dispatch(updateEmail(email)),
  updateUserOtp: mobile => dispatch(updateOtp(mobile)),
  // updateGender: gender => dispatch(updateGender(gender)),
  updateUserDob: dob => dispatch(updateDob(dob)),
  updateSocialImage: img => dispatch(updateUserSocialImage(img)),
  updateUserHeight: height => dispatch(updateHeight(height)),
  updateUserWeight: weight => dispatch(updateWeight(weight)),
  updateUserInviteCode: inviteCode => dispatch(updateInviteCode(inviteCode))
});

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uName: '',
      uMobile: '',
      email: '',
      buttonDisable: true,
      inviteCode: '',
      dobDate: null
    };
  }
  // Button Disable

  ButtonDisable = () => {
    const { uName, uMobile } = this.state;
    setTimeout(() => {
      if (uName !== '' && uMobile.length !== 0) {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  // save register
  registerUser = async () => {
    const regex = /^[_a-zA-Z]+([._]?[a-zA-Z0-9]+)*$/;
    const {
      uName, uMobile, dobDate, inviteCode, email
    } = this.state;
    const {
      showAlert, nextHandler, updateName, updateUserMobile,
      updateUserEmail, updateUserInviteCode
    } = this.props;
    // console.log("name:"+this.state.name)
    // console.log("regex:"+regex.test(this.state.name))
    if (uName.trim() === '' || !regex.test(uName)) {
      showAlert('Oops!', 'Please enter valid Username', 'danger', 'Close');
      await this.setState({ uName: '' });
    } else if (uMobile.length !== 10) {
      showAlert('Oops!', 'Please enter valid mobile number', 'danger', 'Close');
    } else if (dobDate === '') {
      showAlert('Oops!', 'Please enter Date Of Birth', 'danger', 'Close');
    } else {
      fetch(`${BASE_URL}/api/registrationValidation`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: uName.trim(),
          mobile: uMobile,
          inviteCode: inviteCode ? inviteCode.trim() : ''
        })
      }).then(response => response.json())
        .then(async (responseJson) => {
          if (responseJson.hasOwnProperty.call(responseJson, 'status')) {
            await (
              updateName(uName),
              updateUserMobile(uMobile !== '' ? uMobile : null),
              updateUserEmail(email),
              // this.props.updateGender(this.state.gender),
              // this.props.updateDob(this.state.dobText),
              updateUserInviteCode(inviteCode)
            );
            nextHandler();
          } else if (responseJson.hasOwnProperty.call(responseJson, 'err')) {
            showAlert('Oops!', responseJson.err, 'danger', 'Close');
          }
        })
        .catch(() => { });
    }
  }

  render() {
    const { uName, buttonDisable } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <FloatingLabel
            underlineColorAndroid="#fff"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            style={styles.customStyle}
            value={uName}
            onChangeText={async (text) => {
              await this.setState({ uName: text.replace(' ', '').trim() });
              this.ButtonDisable();
            }}
            accessible
            accessibilityLabel="Username"
            accessibilityHint="Provide Username"
          >
            Username
          </FloatingLabel>
        </View>
        {/* <View>

          <FloatingLabel
            underlineColorAndroid="#fff"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            style={styles.customStyle}
            onFocus={this.onDOBPress.bind(this)}
            onChangeText={this.onDOBPress.bind(this)}
            value={this.state.dobText}
            accessible
            accessibilityLabel="Date of Birth"
            accessibilityHint="Provide Date of Birth"
          >
            Date Of Birth
          </FloatingLabel>

        </View> */}
        <View>
          <FloatingLabel
            underlineColorAndroid="#fff"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            keyboardType="numeric"
            maxLength={10}
            style={styles.customStyle}
            onChangeText={async (text) => {
              await this.setState({ uMobile: text.replace(/[^0-9]/g, '') });
              this.ButtonDisable();
            }}
            accessible
            accessibilityLabel="Mobile"
            accessibilityHint="Provide Mobile Number"
          >
            Mobile
          </FloatingLabel>
        </View>
        {/* <View style={{ marginTop: 10 }}>
          <Text style={{ marginLeft: 10, color: 'white', fontSize: 20 }}>Gender</Text>
          <View>
            <RadioGroup selectedIndex={0}
            style={{ justifyContent: 'center', display: 'flex', flexDirection: 'row' }}
            color="white" onSelect={(index, value) => this.onSelect(index, value)}>
              <RadioButton value="Male" color="white">
                <Text style={{ color: 'white' }}>Male</Text>
              </RadioButton>
              <RadioButton value="Female" color="white">
                <Text style={{ color: 'white' }}>Female</Text>
              </RadioButton>
              <RadioButton value="Others" color="white">
                <Text style={{ color: 'white' }}>Others</Text>
              </RadioButton>

            </RadioGroup>
          </View>
        </View> */}

        <FloatingLabel
          underlineColorAndroid="#fff"
          labelStyle={styles.inviteLabelStyle}
          inputStyle={styles.inputStyle}
          style={styles.customStyle}
          onChangeText={(text) => { this.setState({ inviteCode: text }); }}
          accessible
          accessibilityLabel="InviteCode"
          accessibilityHint="Provide InviteCode"
        >
          Invite Code (Optional)
        </FloatingLabel>

        <View>
          <TouchableOpacity
            style={buttonDisable ? styles.disableBtn : styles.zulBtn}
            onPress={this.registerUser}
            disabled={buttonDisable}
          >
            <Text style={styles.whiteText}>{'Create new account'.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  datePickerBox: {
    marginTop: 5,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 20,
    justifyContent: 'center',
  },
  flexOne: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  datePickerText: {
    fontSize: 20,
    marginLeft: 5,
    borderWidth: 0,
    color: 'white',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 20,
    color: '#fff'
  },
  zulBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  disableBtn: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont
  },
  blackText: {
    color: '#000',
    ...regularButtonFont
  },
  labelStyle: { color: '#fff', },
  inviteLabelStyle: {
    fontSize: 17,
    color: '#fff'
  },
  inputStyle: {
    height: 60,
    borderWidth: 0,
    color: '#fff',
    ...Platform.select({
      ios: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
      }
    }),
  },
  customStyle: {
    borderBottomWidth: 0,
    borderColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
