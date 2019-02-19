import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import {
  Left, Body, Right, List, ListItem, Toast
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import Base64 from 'react-native-image-base64';
import { GoogleSignin } from 'react-native-google-signin';
import Dialog from 'react-native-dialog';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import UserImagePostService from '../../api/userImage/UserImagePostService';
import UserImageStoreService from '../../api/userImage/userImageStoreService';
import {
  updateUsername, updateDob, updateUserSocialImage, updateFetchedUrl, resetState,
  updateUserImageDetails
} from '../../store/actions/index';
import { updateCurrentFlow } from '../../store/actions/assessment';
import { BASE_URL, headers } from '../../api/config/Config';
import BottomZulTabs from '../../components/ui/navigation/BottomZulTabs';
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import uploadImageHandler from '../../components/utility/userImage/GetUserImage';

const mapStateToProps = state => ({
  uName: state.User.name,
  uSocialImage: state.User.socialImage,
  fetchedUrl: state.User.fetchedURL,
  gender: state.User.gender,
  imageDetails: {
    secure_url: state.User.imageDetails.secure_url,
    public_id: state.User.imageDetails.public_id,
    created_at: state.User.imageDetails.created_at
  }
});
const mapDispatchToProps = dispatch => ({

  updatedUserName: name => dispatch(updateUsername(name)),
  updatedFetchedUrl: url => dispatch(updateFetchedUrl(url)),
  updatedUserSocialImage: uri => dispatch(updateUserSocialImage(uri)),
  updatedDob: dob => dispatch(updateDob(dob)),
  updatedCurrentFlow: flow => dispatch(updateCurrentFlow(flow)),
  ResetState: () => dispatch(resetState()),
  updatedUserImageDetails: imageDetails => (updateUserImageDetails(imageDetails)),
});


export class UserSettings extends Component {
  state = {
    isRegister: true,
    dataBase64: '',
    count: 0,
    spinner: true,
    isDialogVisible: false,
    inviteCode: ''
  };

  componentWillMount() {
    this.setState({ spinner: false });
  }

  update = (imageDetails) => {
    const {
      updatedUserSocialImage, uName, updatedFetchedUrl, updatedUserImageDetails
    } = this.props;
    const { count } = this.state;
    updatedUserSocialImage('');
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
      .then((responseJson) => {
        // console.log("resa", responseJson);
        // fetch(`${BASE_URL}/api/user/deleteUserImage`, {
        //   method: 'POST',
        //   headers,
        //   body: JSON.stringify({ id: responseJson.image.imageID })
        // }).then(response => response.json());
        updatedFetchedUrl(imageDetails.secure_url);
        updatedUserImageDetails(imageDetails);
      });
    if (count > 0) {
      Toast.show({
        text: 'Updated Successfully....',
        duration: 2000,
        type: 'default'
      });
      this.setState({ spinner: false, count: 0 });
    }
  }

  // uploadImage = () => {
  //   const { uName, updatedFetchedUrl } = this.props;
  //   const { dataBase64 } = this.state;
  //   UserImagePostService.fetchUserPostData(dataBase64)
  //     .then((responseJson) => {
  //       const profileImage = {
  //         image: responseJson,
  //         user: uName
  //       };
  //       UserImageStoreService.fetchUserStoreData(profileImage);
  //     })
  //     .then(() => {
  //       setTimeout(() => {
  //         // this.getImageHandler()
  //         getImageHandler(uName, updatedFetchedUrl);
  //       }, 1000);
  //       const { count } = this.state;
  //       if (count > 0) {
  //         setTimeout(() => {
  //           this.update();
  //         }, 2500);
  //       }
  //     });
  // }

  pickImageHandler = () => {
    const { uName } = this.props;
    const options = {
      title: 'Choose Profile Picture',
      maxWidth: 512,
      maxHeight: 512,
      cameraType: 'front',
      rotation: 0,
      allowsEditing: true,

    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        Toast.show({
          text: 'Cancel By User',
          duration: 2000,
          type: 'default'
        });
      } else if (response.error) {
        Toast.show({
          text: 'Something Went Wrong',
          duration: 2000,
          type: 'default'
        });
      } else {
        const source = {
          uri: response.uri,
          base64: response.data
        };
        // Base64.getBase64String(response.uri)
        //   .then(data => this.setState({ dataBase64: data }))
        //   .catch(() => { });
        this.setState({
          count: 1,
          spinner: true
        });
        uploadImageHandler(source.uri, this.update, uName);
        // this.upload(source.uri)
        // fetch(BASE_URL + '/api/updateUserImage', {
        //     method: 'POST',
        //     headers,
        //     body: JSON.stringify({
        //         url: this.state.pickedImage.uri
        //     })
        //   }).then((response) => response.json())
        //     .then((responseJson) => {
        //         console.log("res",responseJson)
        //     })
        // setTimeout(() => {
        //     this.update()
        // }, 1000)
      }
    });
  };

  logout = async () => {
    const { navigation, ResetState } = this.props;
    try {
      await ResetState();
    } catch (error) {
      Toast.show({
        text: 'Error Occured',
        duration: 2000,
        type: 'default'
      });
    }

    this.signOut();
    const { updatedCurrentFlow } = this.props;
    navigation.navigate('StartPage');
    updatedCurrentFlow('NEW');
  };

  signOut = async () => {
    const { updatedDob } = this.props;
    updatedDob(null);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('UserSocialImage');
      if (await GoogleSignin.isSignedIn()) { await GoogleSignin.signOut(); }
    } catch (error) {
      Toast.show({
        text: 'Error Occured',
        duration: 2000,
        type: 'default'
      });
    }
    if (AccessToken.getCurrentAccessToken()) {
      await LoginManager.logOut();
    }
  };

  changeAuthMode = () => {
    this.setState(prevState => ({ isRegister: !prevState.isRegister }));
  };

  mapInviteCode = () => {
    const { uName } = this.props;
    const { inviteCode } = this.state;
    fetch(`${BASE_URL}/api/mapInviteCodeToUserFromSettings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userName: uName,
        inviteCode: inviteCode.trim()
      })
    }).then(response => response.json(),
      this.setState({ inviteCode: '' }))
      .then((responseJson) => {
        if (responseJson.error) {
          Toast.show({
            text: responseJson.error,
            duration: 2000,
            type: 'default'
          });
        } else {
          Toast.show({
            text: 'Invite Code Added..',
            duration: 2000,
            type: 'default'
          });
        }
      })
      .catch(() => { });
  };

  dailogVisible = () => {
    this.setState(prevState => ({ isDialogVisible: !prevState.isDialogVisible }));
  };

  submit = () => {
    const { inviteCode } = this.state;
    if (inviteCode.trim() === '') {
      Toast.show({
        text: 'Please enter a valid invite code..',
        duration: 2000,
        type: 'default'
      });
    } else {
      this.dailogVisible();
      this.mapInviteCode();
    }
  };

  gotoPage = (i, Name) => {
    const { navigation } = this.props;
    if (i !== 3) {
      if (i !== 6) {
        navigation.navigate(Name);
      } else {
        this.logout();
      }
    } else {
      this.dailogVisible();
    }
  };

  imageCondition = () => {
    const { fetchedUrl, uSocialImage } = this.props;
    let source = { uri: '' };
    if (fetchedUrl !== null && fetchedUrl !== '') {
      source = { uri: fetchedUrl };
    } // else if (uSocialImage !== null && uSocialImage !== '') {
    // source = { uri: uSocialImage };
    // }
    else {
      source = { uri: 'https://res.cloudinary.com/pratian-technologies/image/upload/v1548073832/Zul-Profile-Image/login-user-icon.png' };
    }
    return source;
  };


  render() {
    const list = [
      { label: 'Personal Settings', func: 'PersonalSetting', Icon: 'user-circle-o' },
      { label: 'Privacy Settings', func: 'PrivacySetting', Icon: 'lock' },
      // { 'label': 'Terms & Conditions', 'func': '' },

      { label: 'Change Passcode', func: 'ChangePasscode', Icon: 'key' },
      { label: 'Add Invite Code', func: '', Icon: 'envelope-open' },
      { label: 'Help', func: 'ReportIssue', Icon: 'question-circle-o' },
      { label: 'Account Control', func: 'AccountControl', Icon: 'user-md' },
      { label: 'Logout', func: 'logout', Icon: 'sign-out' }
    ];
    const {
      uName,
      navigation
    } = this.props;
    const {
      isDialogVisible,
      spinner
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ backgroundColor: 'white' }} keyboardShouldPersistTaps="handled">
          <Dialog.Container visible={isDialogVisible} style={{ borderRadius: 8 }}>
            <Dialog.Title style={styles.titleStyle}>
              {'Add Invite Code'}
            </Dialog.Title>
            <Dialog.Description style={styles.descStyle}>
              {'Please enter your invite code below'}
            </Dialog.Description>
            <Dialog.Input
              style={styles.dialogInput}
              maxLength={6}
              placeholder="Enter invite code"
              onChangeText={inputText => this.setState({ inviteCode: inputText })}
            >
            </Dialog.Input>
            <Dialog.Button label="Cancel" onPress={this.dailogVisible} />
            <Dialog.Button label="Submit" onPress={this.submit} />
          </Dialog.Container>

          <View style={styles.imageFlex}>
            <TouchableOpacity onPress={this.pickImageHandler}>
              <View style={styles.image}>
                {spinner
                  ? <ActivityIndicator animating={spinner} color="rgb(66, 159, 247)" size="large" />
                  : (
                    <Image
                      style={styles.imagesrc}
                      source={this.imageCondition()}
                      accessible
                      accessibilityLabel="Profile Picture"
                      accessibilityHint="User Profile Picture"
                    />
                  )}
              </View>
            </TouchableOpacity>
          </View>
          <ListItem>
            <View style={styles.userName}>
              <View>
                <Text style={{
                  fontSize: 25, textAlign: 'center', color: '#144E76', ...usernameFontStyle,
                }}
                >
                  {uName}
                </Text>
              </View>
            </View>
          </ListItem>


          <View style={styles.touchID}>

            <List>

              {list.map((Names, i) => (


                <ListItem
                  key={Names.func}
                  onPress={
                    ({ Name = Names.func }) => { this.gotoPage(i, Name); }}
                >
                  <Left>
                    <View style={styles.list}>
                      <View style={{ alignItems: 'center', alignSelf: 'center', width: 50 }}>
                        <Icon name={Names.Icon} size={20} color="grey" />
                      </View>
                      <View><Text style={styles.listText}>{Names.label}</Text></View>

                    </View>
                  </Left>

                  <Body />
                  <Right>
                    {i !== 6
                      ? <Icon name="angle-right" size={20} color="grey" /> : null
                    }
                  </Right>
                </ListItem>

              ))}

            </List>

          </View>
        </ScrollView>
        <BottomZulTabs navigator={navigation} activeTab="settings" />
      </View>
    );
  }
}

const menuItemFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const usernameFontStyle = fontMaker({ family: 'OpenSans', weight: 'Bold' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  authModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  authModeText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  logoutContainer: {
    width: '40%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  imageFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  list: {
    flex: 1,
    flexDirection: 'row',
  },
  listText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 5,
    width: '100%',
    ...menuItemFontStyle
  },
  image: {
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: 150,
    borderRadius: 75
  },
  imagesrc: {
    height: 150,
    width: 150,
    borderRadius: 75
  },
  userName: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  touchID: {
    flex: 3,
    justifyContent: 'flex-start'
  },
  textWhite: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  HomeBtn: {
    width: '40%',
    backgroundColor: '#2980b9',
    marginHorizontal: 10,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 8,
    marginLeft: 60,
    marginRight: 60
  },
  whiteText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  titleStyle: {
    color: 'black',
    alignSelf: 'center'
  },
  descStyle: { color: 'black' },
  dialogInput: {
    ...Platform.select({ ios: { padding: 10 } }),
    paddingHorizontal: 10
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
