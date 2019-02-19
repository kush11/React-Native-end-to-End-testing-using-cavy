import React, { Component } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView
} from 'react-native';
import {
  Left, Body, List, ListItem, Toast
} from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import {
  updateTempHeight, updateTempWeight, updateTempDob, updateWeight, updateHeight, updateDob,
  updateBmi, updateGender
} from '../../store/actions/index';
import CalculateBmi from '../../components/utility/bmi/Bmi';
import { BASE_URL, headers } from '../../api/config/Config';
import { fontMaker, regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  currentAssessment: state.Assessment.currentAssessment,
  uName: state.User.name,
  uHeight: state.User.height,
  uWeight: state.User.weight,
  uDob: state.User.dob
});
const mapDispatchToProps = dispatch => ({
  updatedWeight: weight => dispatch(updateWeight(weight)),
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedBmi: bmi => dispatch(updateBmi(bmi)),
  updatedGender: gender => dispatch(updateGender(gender)),
  updatedDob: dob => dispatch(updateDob(dob)),
  updatedTempHeight: dob => dispatch(updateTempHeight(dob)),
  updatedTempWeight: dob => dispatch(updateTempWeight(dob)),
  updatedTempDob: dob => dispatch(updateTempDob(dob))
});

class PersonalSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dobText: '',
      dobDate: null,
      buttonDisable: true,
      Height: '',
      Weight: '',
      showSCLAlert: false,
      alertMessage: ''
    };
  }

  componentWillMount() {
    const {
      uName, updatedHeight, updatedWeight, updatedGender,
      updatedBmi, updatedDob, uDob, uHeight, uWeight
    } = this.props;
    fetch(`${BASE_URL}/api/user/id`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: uName })
    }).then(response => response.json())
      .then((responseJson) => {
        updatedHeight(responseJson.height);
        updatedWeight(responseJson.weight);
        updatedGender(responseJson.gender);
        updatedBmi(CalculateBmi(responseJson.height, responseJson.weight));
        updatedDob(responseJson.dob);
      });
    if (uDob && uDob !== '') { this.setState({ dobText: moment(uDob).format('MM-DD-YYYY') }); }

    if (uHeight && uHeight !== '') { this.setState({ Height: uHeight }); }

    if (uWeight && uWeight !== '') { this.setState({ Weight: uWeight }); }
  }

  handleOpen = (title) => {
    this.setState({ showSCLAlert: true, alertMessage: title });
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false, alertMessage: '' });
  }

  onDOBPress = async () => {
    let dobDate = null;

    if (!dobDate || dobDate == null) {
      dobDate = new Date(moment().year() - 12, 0, 0);
      this.setState({ dobDate });
    }
    // To open the dialog
    // this.refs.dobDailog.open({
    this.dobDialog.open({
      mode: 'spinner',
      date: dobDate,
      maxDate: new Date(moment().year() - 12, 0, 0, 0), // To restirct future date,
      minDate: new Date(moment().year() - 99, 0, 0, 0) // To restrict past date to 100 year
    });
  }

  onDOBDatePicked = async (date) => {
    await this.setState({
      dobDate: date,
      dobText: moment(date).format('MM-DD-YYYY')
    });
    this.buttonDisable();
  }


  buttonDisable = () => {
    const { dobText, Height, Weight } = this.state;
    setTimeout(() => {
      if (dobText !== '' && Height !== '' && Weight !== '') {
        this.setState({ buttonDisable: false });
      } else {
        this.setState({ buttonDisable: true });
      }
    }, 300);
  }

  updateDetails = () => {
    const {
      dobText, dobDate, Height, Weight
    } = this.state;
    const {
      uName, navigation, currentAssessment, updatedHeight, updatedWeight, updatedDob,
      updatedTempHeight, updatedTempWeight, updatedTempDob
    } = this.props;
    const regex = /^[1-9]+[0-9]*$/;
    if (Height && Weight) {
      if ((Number.isFinite(parseInt(Height, 10)) && Number.isFinite(parseInt(Weight, 10)))
        && regex.test(Height) && regex.test(Weight)) {
        if (Height <= 300 && Weight <= 634) {
          if (uName === '') {
            updatedTempHeight(parseInt(Height, 10));
            updatedTempWeight(parseInt(Weight, 10));
            updatedTempDob(dobDate);
          } else {
            fetch(`${BASE_URL}/api/userData`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                name: uName,
                height: Height,
                weight: Weight,
                dob: dobText
              })
            }).then(response => response.json())
              .catch((error) => {
                Toast.show({
                  text: error,
                  duration: 2000,
                  type: 'default'
                });
              });
            updatedHeight(Height);
            updatedWeight(Weight);
            updatedDob(dobDate);
          }
          navigation.navigate('Assessment', { title: currentAssessment });
        } else {
          this.handleOpen('Height must be <300 and Weight must be <634 ');
        }
      } else {
        this.handleOpen("Height or Weight can not start with '0'.");
      }
    } else {
      this.handleOpen('To continue, please provide all the details.');
    }
  }

  render() {
    const {
      dobText, buttonDisable, Height, Weight, showSCLAlert, alertMessage
    } = this.state;
    return (

      <View style={styles.container}>
        <SCLAlert
          theme="danger"
          show={showSCLAlert}
          title="Oops!"
          subtitle={alertMessage}
          cancellable
          onRequestClose={this.handleClose}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton theme="danger" onPress={this.handleClose} textStyle={{ ...regularButtonFont }}>CLOSE</SCLAlertButton>
        </SCLAlert>

        <ScrollView contentContainerStyle={{ flex: 1, marginTop: 10 }} keyboardShouldPersistTaps="always">
          <View style={styles.touchID}>
            <View>
              <Text style={styles.title}>Please provide the below information to get started</Text>
            </View>

            <List>

              <ListItem>

                <Left>
                  <View style={styles.list}>
                    <View><Text style={styles.listText}>Date of Birth</Text></View>

                  </View>
                </Left>

                <Body>

                  <TextInput
                    placeholder="Enter DOB"
                    style={{ padding: 10, ...inputsFontStyle }}
                    value={dobText}
                    onFocus={() => this.onDOBPress()}
                    onPress={() => this.onDOBPress()}
                    onChangeText={() => this.onDOBPress()}
                    keyboardShouldPersistTaps="handled"
                  />

                </Body>
              </ListItem>
              <ListItem>

                <Left>
                  <View style={styles.list}>
                    <View><Text style={styles.listText}>Height</Text></View>
                    <View style={{ flexDirection: 'row', flex: 1 }}><Text style={{ fontSize: 15, color: 'grey', ...listTextFontStyle }}> (cm)</Text></View>

                  </View>
                </Left>

                <Body>

                  <TextInput
                    placeholder="Enter Height"
                    keyboardType="numeric"
                    maxLength={3}
                    style={{ padding: 10, ...inputsFontStyle }}
                    value={Height.toString()}
                    onChangeText={async (text) => { await this.setState({ Height: text.replace(/[^0-9]/g, '') }); this.buttonDisable(); }}
                  />

                </Body>
              </ListItem>
              <ListItem>

                <Left>
                  <View style={styles.list}>
                    <View><Text style={styles.listText}>Weight</Text></View>
                    <View style={{ flexDirection: 'row' }}><Text style={{ fontSize: 15, color: 'grey', ...listTextFontStyle }}> (kg)</Text></View>

                  </View>
                </Left>

                <Body>

                  <TextInput
                    placeholder="Enter Weight"
                    keyboardType="numeric"
                    maxLength={3}
                    style={{ padding: 10, ...inputsFontStyle }}
                    value={Weight.toString()}
                    onChangeText={async (text) => { await this.setState({ Weight: text.replace(/[^0-9]/g, '') }); this.buttonDisable(); }}
                  />

                </Body>
              </ListItem>
            </List>
            <View>
              <TouchableOpacity
                style={
                  buttonDisable
                    ? styles.disableBtn
                    : styles.zulBtn
                }
                onPress={this.updateDetails}
                disabled={buttonDisable}
              >
                <Text style={[styles.whiteText, { ...regularButtonFont, fontSize: 15 }]}>{'Submit'.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* ref="dobDailog" */}
        <DatePickerDialog ref={(foc) => { this.dobDialog = foc; }} onDatePicked={this.onDOBDatePicked} cancelLabel="CANCEL" okLabel="OK" />
      </View>

    );
  }
}
const titleFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const listTextFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const inputsFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  authModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  title: {
    fontSize: 15,
    paddingLeft: 15,
    ...titleFontStyle
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
  authModeText: {
    color: 'black',
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10
  },
  logInBtn: {
    backgroundColor: '#41ab3e',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    width: 130,
    marginRight: 75,
    marginLeft: 75,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  logoutContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    borderBottomColor: 'grey',
    borderTopColor: 'grey',
    borderWidth: 1
  },

  imageFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  list: { flexDirection: 'row' },
  listText: {
    fontSize: 16,
    color: 'black',
    ...listTextFontStyle
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
    justifyContent: 'center',
    margin: 5,
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
  modal: {
    paddingVertical: 200,
    width: 320,
    alignSelf: 'center'
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalSetting);
