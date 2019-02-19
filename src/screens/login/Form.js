import React, { Component } from 'react';
import {
  Alert, Platform, View, StyleSheet, TouchableOpacity, Text, Image, AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { Toast } from 'native-base';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import Divider from 'react-native-divider';
import moment from 'moment';
import { hook } from 'cavy';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import TouchComponent from '../../components/ui/biometric/TouchId';
import FloatingLabel from '../../components/ui/floatingLabel/floatingLabel';
import {
  updateUsername, updateMobile, updateEmail, updateOtp, updateGender,
  updateDob, updateUserSocialImage, updateFetchedUrl
} from '../../store/actions/index';
import { updateCurrentFlow } from '../../store/actions/assessment';
import { BASE_URL, headers } from '../../api/config/Config';
import GetFacebookInfoService from '../../api/fblogin/fbLoginService';
import {
  saveLoginInfo, getIdentityProvider, isTouchIdEnabled, getLoggedInUserName,
  getLoggedInPassCode, saveIdentityProviderInfo
} from '../../repository/login/LoginRepository';
// import UserImageStoreService from '../../api/userImage/userImageStoreService';
import { defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';
import { updateGoogleToken } from '../../store/actions/users';
import uploadImageHandler from '../../components/utility/userImage/GetUserImage';

const mapStateToProps = state => ({
  passcode: state.User.passcode,
  uName: state.User.name,
  uEmail: state.User.email,
  uSocialImage: state.User.socialImage,
  currentFlow: state.Assessment.currentFlow,
  assessmentId: state.Assessment.assessmentId,
  dob: state.User.dob,
  tempDob: state.User.tempDob
});
const mapDispatchToProps = dispatch => ({
  updateName: name => dispatch(updateUsername(name)),
  updateUserMobile: mobile => dispatch(updateMobile(mobile)),
  updateUserOtp: mobile => dispatch(updateOtp(mobile)),
  updateUserGender: gender => dispatch(updateGender(gender)),
  updateUserCurrentFlow: flow => dispatch(updateCurrentFlow(flow)),
  updateSocialImage: image => dispatch(updateUserSocialImage(image)),
  updateUserDob: dob => dispatch(updateDob(dob)),
  updatedGoogleToken: token => dispatch(updateGoogleToken(token)),
  // updateInviteCode: inviteCode => dispatch(updateInviteCode(inviteCode)),
  updateUserEmail: email => dispatch(updateEmail(email)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url))
});

class Form extends Component {
  constructor() {
    super();
    this.state = {
      uName: '',
      uPasscode: '',
      touchIdPasscode: '',
      isTouchIdEnabledState: false,
      showAlert: false,
      alertMessage: '',
    };
  }

  componentDidMount() {
    isTouchIdEnabled().then((value) => {
      this.setState({ isTouchIdEnabledState: value });
    });
    getLoggedInUserName().then((userName) => {
      this.setState({ uName: userName });
    });
    getLoggedInPassCode().then((userPasscode) => {
      this.setState({ touchIdPasscode: userPasscode });
    });
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.body.read',
        'https://www.googleapis.com/auth/fitness.location.read',
        'https://www.googleapis.com/auth/fitness.nutrition.read',
      ], // what API you want to access on behalf of the user, default is email and profile
    });

    const isSignedIn = GoogleSignin.isSignedIn();
    if (isSignedIn) {
      GoogleSignin.signOut();
    }
    if (AccessToken.getCurrentAccessToken()) {
      LoginManager.logOut();
    }
  }

  componentWillUnmount() {

  }

  showAlertMessage = (message) => {
    this.setState(prevState => ({
      alertMessage: message,
      showAlert: !prevState.showAlert
    }));
  }

  toggleAlert = () => {
    this.setState(prevState => ({ showAlert: !prevState.showAlert }));
  }

  handleClose = () => {
    this.setState(prevState => ({ showAlert: !prevState.showAlert }));
  }

  // upload user image to cloudinary

  update = (imageDetails) => {
    const { uName, updatedFetchedUrl } = this.props;
    // console.log("imah", imageDetails);
    fetch(`${BASE_URL}/api/user/updateUserImageDetails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        userImageURL: imageDetails.secure_url,
        imageID: imageDetails.public_id,
        uploadDate: imageDetails.created_at
      })
    }).then(response => response.json())
      .then(() => {
        updatedFetchedUrl(imageDetails.secure_url);
        // this.props.updateUserImageDetails(imageDetails)
        // debugger;
      });
  }


  // login user
  loginUser = () => {
    const { uName, uPasscode } = this.state;
    const {
      goHome, updateName, updateUserDob, updateSocialImage, updateUserCurrentFlow,
      updatedFetchedUrl
    } = this.props;
    if (this.canLoginUser()) {
      fetch(`${BASE_URL}/api/getpasscode`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: uName,
          passcode: uPasscode
        })
      }).then(response => response.json())
        .then((responseJson) => {
          if (responseJson) {
            if (responseJson.status === 'verify') {
              const token = responseJson.token;
              AsyncStorage.setItem('userToken', token);
              updateName(uName);
              updateUserDob(responseJson.result.dob);
              updateSocialImage('');
              updatedFetchedUrl(responseJson.result.image.userImageURL);
              updateUserCurrentFlow('REGISTERED');
              const userinfo = {
                name: uName,
                passcode: uPasscode,
                enableTouchId: 'false',
                identityProvider: 'ZUL'
              };
              saveLoginInfo(userinfo);
              if (responseJson.userStatus === 'Inactive') {
                Alert.alert(
                  'Welcome Back',
                  'We Greet you to come back',
                  [
                    {
                      text: 'Ok',
                      onPress: () => {
                        goHome();
                      }
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                goHome();
              }
            } else if (responseJson.status === '401') {
              this.showAlertMessage('username/passcode do not match');
            } else if (responseJson.status !== 'verify') {
              this.showAlertMessage('username/passcode do not match');
            }
          }
        })
        .catch(() => {
          this.showAlertMessage('Please enter a valid Username');
        });
    }
  }

  // login user

  initUser = async () => {
    await AccessToken.getCurrentAccessToken().then((data) => {
      const { accessToken } = data;
      const { updateName, updateUserEmail, updateSocialImage } = this.props;
      GetFacebookInfoService.fetchFacebookInfo(accessToken)
        .then(async (json) => {
          await (
            updateName(json.email.split('@')[0].trim()),
            updateSocialImage(json.picture.data.url),
            updateUserEmail(json.email),
            AsyncStorage.setItem('UserSocialImage', json.picture.data.url)
          );
          saveIdentityProviderInfo('FB');
          this.checkUserByEmail('FB');
        })
        .catch(() => {
          // reject('ERROR GETTING DATA FROM FACEBOOK');
          Toast.show({
            text: 'Sign In Cancelled by User',
            duration: 2000,
            type: 'default'
          });
        });
    });
  }

  fbSignIN = async () => {
    await LoginManager.logInWithReadPermissions(['email', 'public_profile']).then((result) => {
      if (result.isCancelled) {
        Toast.show({
          text: 'Sign In Cancelled by User',
          duration: 2000,
          type: 'default'
        });
      } else {
        //  console.log('Login Successful', result);
      }
    }, () => {
      // console.log(`An error occured${error}`);
    });
    await this.initUser();
  }

  canLoginUser = () => {
    const { uName, uPasscode } = this.state;
    let canLogin = false;
    if (uName && uPasscode === '') {
      this.showAlertMessage('Please enter passcode');
    } else if (uPasscode && uName === '') {
      this.showAlertMessage('Please enter username');
    } else if (uName === '' && uPasscode === '') {
      this.showAlertMessage('Please enter username & passcode');
    } else {
      canLogin = true;
    }
    return canLogin;
  }

  signIn = async () => {
    const {
      updateName, updateUserEmail, updateSocialImage, updatedGoogleToken
    } = this.props;
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      AsyncStorage.setItem('googleToken', userInfo.accessToken);
      updatedGoogleToken(userInfo.accessToken);

      await (
        updateName(userInfo.user.email.split('@')[0].trim()),
        updateSocialImage(userInfo.user.photo),
        updateUserEmail(userInfo.user.email)
      );
      AsyncStorage.setItem('UserSocialImage', userInfo.user.photo);
      this.checkUserByEmail('Google');
      saveIdentityProviderInfo('Google');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          text: 'Sign In Cancelled by User',
          duration: 2000,
          type: 'default'
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          text: 'operation (f.e. sign in) is in progress already',
          duration: 2000,
          type: 'default'
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          text: 'Play services not available or outdated',
          duration: 2000,
          type: 'default'
        });
      } else {
        Toast.show({
          text: 'Some other error happened',
          duration: 2000,
          type: 'default'
        });
      }
      await AsyncStorage.removeItem('UserSocialImage');
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
    }
  };

  checkUserByEmail = (medium) => {
    const {
      goHome, updateName, updateUserDob, updatedFetchedUrl, updateUserCurrentFlow, uEmail, currentFlow
    } = this.props;
    fetch(`${BASE_URL}/api/getemail`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: uEmail })
    }).then(response => response.json())
      .then(async (responseJson) => {
        if (responseJson) {
          if (responseJson.token) { await AsyncStorage.setItem('userToken', responseJson.token); }
          if (responseJson.result.email === uEmail) {
            if (currentFlow === 'NEW') {
              await (
                updateName(responseJson.result.name),
                updateUserDob(responseJson.result.dob),
                updatedFetchedUrl(responseJson.result.image.userImageURL),
                updateUserCurrentFlow('REGISTERED')
              );
              goHome();
            } else {
              this.registerSocialUser(medium);
            }
          } else {
            this.registerSocialUser(medium);
          }
        }
      })
      .catch(async () => {
        this.registerSocialUser(medium);
      });
  }

  // Touch id
  registerSocialUser = (medium) => {
    const {
      uName, uEmail, updateName, updateUserMobile, updateUserEmail, updateUserOtp, updateUserGender, updateUserDob
    } = this.props;
    fetch(`${BASE_URL}/api/registrationValidation`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uEmail.split('@')[0].trim(),
        inviteCode: ''
      })
    }).then(response => response.json())
      .then(async (responseJson) => {
        if (responseJson.hasOwnProperty.call(responseJson, 'status')) {
          await (
            updateName(uName),
            updateUserMobile(''),
            updateUserEmail(uEmail),
            updateUserOtp(''),
            updateUserGender(''),
            updateUserDob('')
          );
          await this.submitPasscode(medium);
        } else if (responseJson.hasOwnProperty.call(responseJson, 'err')) {
          Toast.show({
            text: responseJson.err,
            duration: 2000,
            type: 'default'
          });
        }
      })
      .catch(() => { });
  }

  // map answers to user
  mapAnswerToUser = () => {
    const { assessmentId, uName, tempDob } = this.props;
    const obj = {
      id: assessmentId,
      userName: uName,
      dob: tempDob ? moment(tempDob).format('MM-DD-YYYY') : null
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

  submitPasscode = (medium) => {
    const {
      uName, uEmail, currentFlow, reportsNavigation
    } = this.props;
    fetch(`${BASE_URL}/api/user`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uEmail.split('@')[0].trim(),
        email: uEmail,
        passcode: '',
        gender: '',
        dob: '',
        height: 0,
        weight: 0,
        inviteCode: '',
        image: {
          userImageURL: '',
          imageID: '',
          uploadDate: ''
        }
      })
    }).then(response => response.json())
      .then((responseJson) => {
        if (responseJson.code === 11000) {
          this.showAlertMessage('User already registered in ZUL system');
        } else if (responseJson.status === 'Invalid invite code') {
          this.showAlertMessage('Enter valid Invite code');
        } else {
          if (currentFlow === 'UNREGISTERED') {
            this.mapAnswerToUser();
          }
          const userinfo = {};
          userinfo.reportsNavigation = reportsNavigation;
          userinfo.name = uName;
          userinfo.passcode = '';
          userinfo.currentFlow = currentFlow;
          userinfo.identityProvider = medium;
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
  }

  completeRegisteration = async (userinfo) => {
    // TODO: remove the hotfix for a sustainable solution
    const { showAlert, uSocialImage, uName } = this.props;
    // const profileImage = {
    //   image: { imageUrl: uSocialImage },
    //   user: uName
    // };
    // updateUserCurrentFlow('REGISTERED');
    AsyncStorage.setItem('enableTouchId', userinfo.enableTouchId); // hotfix #1164
    saveLoginInfo(userinfo);
    uSocialImage === '' || !uSocialImage ? null : await uploadImageHandler(uSocialImage, this.update, uName);
    // (uSocialImage === '' || !uSocialImage) ? null : await UserImageStoreService.fetchUserStoreData(profileImage);
    showAlert('Congratulations!', 'You are now a Zinger!\nYour wellness journey begins.');
  }

  touchId = () => {
    const { uName, touchIdPasscode } = this.state;
    const {
      goHome, updateName, updateSocialImage,
      updateUserCurrentFlow, updateUserDob
    } = this.props;

    // console.log('uName:' + uName + ' uPassword:' + touchIdPasscode);
    getIdentityProvider().then((provider) => {
      switch (provider) {
        case 'Google':
          this.signIn();
          break;
        case 'FB':
          this.fbSignIN();
          break;
        default:
          setTimeout(() => {
            fetch(`${BASE_URL}/api/getpasscode`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                name: uName,
                passcode: touchIdPasscode
              })
            }).then(response => response.json())
              .then((responseJson) => {
                if (responseJson) {
                  AsyncStorage.setItem('userToken', responseJson.token);
                  updateName(uName);
                  updateUserDob(responseJson.result.dob);
                  updateSocialImage('');
                  updateUserCurrentFlow('REGISTERED');

                  goHome();
                }
              })
              .catch(() => {
                this.showAlertMessage('Touch Id error. Please login with your credentials');
              });
          }, 200);
          break;
      }
    });
  }

  render() {
    const {
      uPasscode, showAlert, alertMessage, isTouchIdEnabledState, uName
    } = this.state;
    const { goForgotPassword, goRegister, generateTestHook } = this.props;
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        enableOnAndroid
        style={styles.container}
      >
        <SCLAlert
          theme="danger"
          show={showAlert}
          title="Oops!"
          subtitle={alertMessage}
          cancellable
          onRequestClose={this.toggleAlert}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton
            theme="danger"
            onPress={this.toggleAlert}
            textStyle={{ ...regularButtonFont }}
          >
            CLOSE
          </SCLAlertButton>
        </SCLAlert>

        <View style={styles.loginActionView}>
          {/* eslint-disable global-require */}
          <Image style={styles.loginLogo} source={require('../../assets/images/onboard/zulNew.png')} />
          {/* eslint-enable global-require */}
          {/* <Text style={styles.loginText}>Login To Account</Text> */}
        </View>
        <View style={styles.loginInput}>

          <FloatingLabel
            underlineColorAndroid="#fff"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            style={styles.customStyle}
            value={uName}
            ref={generateTestHook('Username.TextInput')}
            onChangeText={text => this.setState({ uName: text })}
            accessible
            accessibilityLabel="Username"
            accessibilityHint="Provide Username"
          >
            Username
          </FloatingLabel>
          <FloatingLabel
            underlineColorAndroid="#fff"
            labelStyle={styles.labelStyle}
            inputStyle={styles.inputStyle}
            secureTextEntry
            keyboardType="numeric"
            value={uPasscode}
            ref={generateTestHook('Passcode.TextInput')}
            style={styles.customStyle}
            maxLength={4}
            onChangeText={async (text) => { await this.setState({ uPasscode: text.replace(/[^0-9]/g, '') }); }}
            accessible
            accessibilityLabel="Passcode"
            accessibilityHint="Provide Passcode"
          >
            Passcode
          </FloatingLabel>
          {isTouchIdEnabledState
            ? (
              <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
                <View style={{ flex: 3 }}>
                  <TouchableOpacity style={styles.logInBtnwithTouchId} onPress={this.loginUser}>
                    <Text style={styles.whiteText}>{'Login'.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.touchID}>
                  <TouchComponent
                    goHome={this.touchId}
                    askByDefault={isTouchIdEnabledState}
                    accessible
                    accessibilityLabel="Touch Id Authentication"
                    accessibilityHint="Access application by Touch Id"
                  />
                </View>
              </View>
            )
            : (
              <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
                <View style={{ flex: 3 }}>
                  <TouchableOpacity style={styles.logInBtn} ref={generateTestHook('Action.LoginButton1')} onPress={this.loginUser}>
                    <Text style={styles.whiteText}>{'Login'.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          <View style={styles.flexRow}>
            <View style={styles.flexOne}>

              <TouchableOpacity style={styles.forgotBtn} onPress={goForgotPassword}>
                <Text style={[styles.whiteText, styles.underlineStyle]}>Forgot passcode?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupStyle}>
              <TouchableOpacity style={styles.registerBtn} onPress={goRegister}>
                <Text style={[styles.whiteText, styles.underlineStyle]}>New Here? Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginLeft: 30, marginRight: 30, marginTop: 20 }}>
            <Divider fontSize="20" fontWeight="bold" borderColor="#cbd9ba" color="#fff" orientation="center" borderStyle="dashed">
              OR
            </Divider>
          </View>

          <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
            <View style={{ flex: 3 }}>
              <TouchableOpacity style={styles.googleBtn} onPress={() => this.signIn()}>
                <Text style={styles.whiteText}>{'Login with google'.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginLeft: 40, marginRight: 40 }}>
            <View style={{ flex: 3 }}>
              <TouchableOpacity style={styles.facebookBtn} onPress={() => this.fbSignIN()}>
                <Text style={styles.whiteText}>{'Login with facebook'.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>


          {/* {this.state.isTouchIdEnabled && <View style={styles.biometricStyle}>
<View style={styles.touchIdStyle}>
<TouchableOpacity
accessible={true}
accessibilityLabel="Fcae Id Authentication"
accessibilityHint="Access application by Face Recognition">
<Image style={styles.imgStyle}
source={require('../../assets/images/loginwallpapers/faceIdWhite.png')} />
</TouchableOpacity>
</View>
 <TouchComponent goHome={this.touchId} askByDefault={this.state.isTouchIdEnabled}
 accessible={true}
 accessibilityLabel="Touch Id Authentication"
 accessibilityHint="Access application by Touch Id" />
 </View>} */}

        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(hook(Form));

const styles = StyleSheet.create({
  touchIdStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  biometricStyle: {
    flexDirection: 'row',
    marginTop: 10
  },
  signupStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  underlineStyle: { textDecorationLine: 'underline' },
  flexOne: { flex: 1 },
  flexRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  inputBorder: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  loginInput: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center'
  },
  loginText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center'
  },
  loginActionView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgStyle: {
    width: 50,
    height: 45
  },
  container: {
    flex: 0.75,
    flexDirection: 'column'
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 20,
    color: '#fff'
  },
  loginLogo: {
    marginTop: 40,
    marginBottom: 20
  },
  touchID:
  {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 5,
    flex: 1,
    borderColor: '#41ab3e',
    borderWidth: 2,
    alignSelf: 'center',
    height: 60,
    top: 10,
    borderRadius: 8
  },
  logInBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  logInBtnwithTouchId: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  googleBtn: {
    backgroundColor: '#db4a40',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  facebookBtn: {
    backgroundColor: '#49659c',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
    borderRadius: 8
  },
  forgotBtn: {
    padding: 5,
    margin: 10
  },
  whiteText: {
    color: '#ffffff',
    fontSize: 15,
    ...regularButtonFont,
  },
  registerBtn: {
    padding: 5,
    margin: 10
  },

  labelStyle: { color: '#fff' },

  inputStyle: {
    height: 50,
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
    borderBottomRightRadius: 10,
    marginLeft: 20,
    marginRight: 20
  }
});
