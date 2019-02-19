import React, { Component } from 'react';
import {
  Platform, View, StyleSheet, Text, Switch, Alert
} from 'react-native';
import {
  Left, Body, Right, List, ListItem, Toast
} from 'native-base';
import { saveTouchIdInfo, isTouchIdEnabled } from '../../repository/login/LoginRepository';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

export class PrivateSetting extends Component {
  state = { isRegister: false };

  componentDidMount() {
    isTouchIdEnabled().then((isTouch) => {
      this.setState({ isRegister: isTouch });
    });
  }

  toastMessage = () => {
    Toast.show({
      text: 'This feature will be Available Soon',
      duration: 2000,
      type: 'default'
    });
  }

  changeAuthMode = () => {
    const { isRegister } = this.state;
    const userinfo = {};
    if (!isRegister) {
      Alert.alert(
        'Enable Touch Id',
        'Do you want to enable touch id?',
        [
          {
            text: 'NO',
            onPress: () => {
              userinfo.enableTouchId = 'false';
              saveTouchIdInfo(userinfo);
              this.setState({ isRegister: false });
            },
            style: 'cancel'
          },
          {
            text: 'YES',
            onPress: () => {
              userinfo.enableTouchId = 'true';
              saveTouchIdInfo(userinfo);
              this.setState({ isRegister: true });
            }
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        'Disable Touch Id',
        'Do you want to disable touch id?',
        [
          {
            text: 'NO',
            onPress: () => {
              userinfo.enableTouchId = 'true';
              saveTouchIdInfo(userinfo);
              this.setState({ isRegister: true });
            },
            style: 'cancel'
          },
          {
            text: 'YES',
            onPress: () => {
              userinfo.enableTouchId = 'false';
              saveTouchIdInfo(userinfo);
              this.setState({ isRegister: false });
            }
          },
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    const { isRegister } = this.state;
    const authModeSelectionSection = (
      <View style={styles.authModeContainer}>
        {/* <View ><Text style={styles.authModeText}>OFF</Text></View> */}
        {(Platform.OS === 'ios')
          ? (
            <Switch
              onValueChange={this.changeAuthMode}
              thumbTintColor={isRegister ? '#4b7aa5' : '#cccccc'}
              onTintColor="#00264a"
              value={isRegister}
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
            />
          )
          : (
            <Switch
              thumbTintColor={isRegister ? '#4b7aa5' : '#cccccc'}
              onTintColor="#00264a"
              value={isRegister}
              style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
              onValueChange={this.changeAuthMode}
            />
          )}

      </View>
    );

    return (
      <View style={styles.container}>
        <List>
          <ListItem>

            <Left>
              <View style={styles.list}>
                <View><Text style={styles.listText}>Enable Touch Id</Text></View>

              </View>
            </Left>


            <Body />
            <Right style={{ alignContent: 'center' }}>
              <View>
                {authModeSelectionSection}
              </View>

            </Right>
          </ListItem>
        </List>
      </View>
    );
  }
}

const itemFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
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
    margin: 10,
  },
  list: { flexDirection: 'row' },
  listText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    ...itemFontStyle
  },
});
export default PrivateSetting;
