import React, { Component } from 'react';
import {
  View, StyleSheet, Text, ScrollView
} from 'react-native';
import {
  Left, Body, Right, List, ListItem
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import moment from 'moment';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import Dialog from 'react-native-dialog';
import {
  updateWeight,
  updateHeight,
  updateBmi,
  updateGender,
  updateDob
} from '../../store/actions/index';
import CalculateBmi from '../../components/utility/bmi/Bmi';
import { BASE_URL, headers } from '../../api/config/Config';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  uName: state.User.name,
  uHeight: state.User.height,
  uWeight: state.User.weight,
  uBmi: state.User.bmi,
  uDob: state.User.dob,
  uGender: state.User.gender
});

const mapDispatchToProps = dispatch => ({
  updatedWeight: weight => dispatch(updateWeight(weight)),
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedBmi: bmi => dispatch(updateBmi(bmi)),
  updatedGender: gender => dispatch(updateGender(gender)),
  updatedDob: dob => dispatch(updateDob(dob))
});

export class PersonalSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gender: 'Male',
      dobText: '',
      udobDate: null,
      modalVisible: false,
      index: '',
    };
  }

  componentWillMount() {
    const {
      uName, updatedHeight, updatedWeight, updatedGender, updatedBmi, updatedDob
    } = this.props;
    fetch(`${BASE_URL}/api/user/id`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: uName })
    }).then(response => response.json())
      .then((responseJson) => {
        updatedHeight(responseJson.height);
        updatedWeight(responseJson.weight);
        updatedGender(responseJson.gender ? responseJson.gender : null);
        updatedBmi(CalculateBmi(responseJson.height, responseJson.weight));
        updatedDob(responseJson.dob);
        this.setState({ index: this.condition(responseJson) });
      });
  }

  condition = (responseJson) => {
    if (responseJson.gender === 'Male') {
      return 0;
    }
    if (responseJson.gender === 'Female') {
      return 1;
    }
    if (responseJson.gender === 'Others') {
      return 2;
    }
    return null;
  }

  onDOBPress = async () => {
    const { udobDate } = this.state;
    let dobDate = udobDate;

    if (!dobDate || dobDate == null) {
      dobDate = new Date(moment().year() - 12, 0, 0);
      this.setState({ udobDate: dobDate });
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
    const { dobDate, dobText } = this.state;
    const { uName, updatedDob } = this.props;
    await this.setState({
      dobDate: date,
      dobText: moment(date).format('MM-DD-YYYY')
    });
    updatedDob(dobDate);
    fetch(`${BASE_URL}/api/user/updateUserDob`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        dob: dobText
      })
    }).then((response) => { response.json(); });
  }

  onSelect = (index, value) => {
    this.setState({
      gender: value,
      index
    });
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible,
      index: prevState.index
    }));
  }


  submitGender = () => {
    const { gender } = this.state;
    const { uName, updatedGender } = this.props;
    this.toggleModal();
    updatedGender(gender);
    fetch(`${BASE_URL}/api/user/updateUserGender`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: uName,
        gender
      })
    }).then((response) => {
      response.json();
    });
  }

  pageSelect = (i, Name) => {
    const { uDob, navigation } = this.props;
    if (i === 1) {
      if (uDob) {
        if (uDob === '') {
          this.onDOBPress();
        }
      } else { this.onDOBPress(); }
    }
    if (i === 2) {
      this.toggleModal();
    } else {
      navigation.navigate(Name);
    }
  }

  render() {
    const {
      uName,
      uDob,
      uGender,
      uBmi,
      uHeight,
      uWeight,
    } = this.props;
    const {
      modalVisible, index, stepsCount, caloriesBurned, heartRate, distance
    } = this.state;
    const list = [
      { name: 'Display Name', func: '', label: uName },
      { name: 'Date of Birth', func: '', label: uDob ? moment(uDob).format('LL') : 'Set D.O.B' },
      { name: 'Gender', func: '', label: uGender === '' || uGender === null ? 'Set Gender' : uGender },
      { name: 'BMI', func: '', label: uBmi === '' || uBmi === '0.00' ? 'N.A.' : uBmi },
      { name: 'Height', func: 'ChangeHeight', label: uHeight === 0 || !Number.isFinite(uHeight) ? 'Set height' : (`${uHeight} cm`) },
      { name: 'Weight', func: 'ChangeWeight', label: uWeight === 0 || !Number.isFinite(uWeight) ? 'Set weight' : (`${uWeight} kg`) }];
    return (
      <View style={styles.container}>
        <Dialog.Container visible={modalVisible}>
          <Dialog.Title style={{ color: 'black', alignSelf: 'center' }}>
            {'Select Gender'}
          </Dialog.Title>
          <RadioGroup selectedIndex={index} style={{ justifyContent: 'center', display: 'flex', flexDirection: 'row' }} color="black" onSelect={(index1, value) => this.onSelect(index1, value)}>

            <RadioButton value="Male" color="black">
              <Text style={{ color: 'black', fontSize: 16 }}>Male</Text>
            </RadioButton>


            <RadioButton value="Female" color="black">
              <Text style={{ color: 'black', fontSize: 16 }}>Female</Text>
            </RadioButton>


            <RadioButton value="Others" color="black">
              <Text style={{ color: 'black', fontSize: 16 }}>Others</Text>
            </RadioButton>

          </RadioGroup>

          <Dialog.Button label="Cancel" onPress={this.toggleModal} />
          <Dialog.Button label="Submit" onPress={this.submitGender} />
        </Dialog.Container>
        <ScrollView contentContainerStyle={{ flex: 1, marginTop: 10 }}>
          <View style={styles.touchID}>
            <List>
              {list.map((Names, i) => (
                <ListItem key={Names.func} onPress={({ Name = Names.func }) => { this.pageSelect(i, Name); }}>
                  <Left>
                    <View style={styles.list}>
                      <View><Text style={styles.listText}>{Names.name}</Text></View>
                    </View>
                  </Left>
                  <Body>
                    <Text style={{
                      fontSize: 14, color: 'grey', alignSelf: 'flex-end', ...valueFontStyle
                    }}
                    >
                      {Names.label}
                    </Text>
                  </Body>
                  {i === 4 || i === 5
                    ? (
                      <Right>
                        {Names.name === 'Display Name' || Names.name === 'Date of Birth' || Names.name === 'Gender' || Names.name === 'BMI' ? null
                          : <Icon name="angle-right" size={20} color="grey" />}
                      </Right>
                    )
                    : null
                  }
                </ListItem>
              ))}
            </List>
          </View>
        </ScrollView>
        <DatePickerDialog ref={(foc) => { this.dobDialog = foc; }} onDatePicked={this.onDOBDatePicked} />
      </View>
    );
  }
}

const itemFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const valueFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
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
    ...itemFontStyle
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalSetting);
