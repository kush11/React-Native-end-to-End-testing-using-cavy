import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity, PickerIOS
} from 'react-native';
import Picker from 'react-native-wheel-picker';
import { connect } from 'react-redux';
import { updateWeight, updateBmi } from '../../store/actions/index';
import { BASE_URL, headers } from '../../api/config/Config';
import CalculateBmi from '../../components/utility/bmi/Bmi';
import { regularButtonFont, fontMaker } from '../../components/utility/fonts/FontMaker';

const PickerItemIOS = PickerIOS.Item;

const mapStateToProps = state => ({
  name: state.User.name,
  uHeight: state.User.height,
  uWeight: state.User.weight,
});
const mapDispatchToProps = dispatch => ({

  updatedWeight: weight => dispatch(updateWeight(weight)),
  updatedBmi: bmi => dispatch(updateBmi(bmi))
});
const PickerItem = Picker.Item;
export class WeightChange extends Component {
  constructor(props) {
    super(props);
    const { uWeight } = this.props;
    this.state = {
      selectedItem: uWeight === '' ? 0 : uWeight,
      itemList: []

    };
    const { itemList } = this.state;
    for (let i = 0; i <= 634; i += 1) {
      itemList[i] = i;
    }
  }

  onPickerSelect(index) {
    this.setState({ selectedItem: index });
  }

  onAddItem = () => {
    const {
      name, uHeight, navigation, updatedWeight, updatedBmi
    } = this.props;
    const { itemList, selectedItem } = this.state;
    fetch(`${BASE_URL}/api/userData`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name,
        weight: itemList[selectedItem]
      })
    }).then(response => response.json(),
      updatedWeight(itemList[selectedItem]))
      .then(updatedBmi(CalculateBmi(uHeight, itemList[selectedItem])))
      .then(navigation.navigate('PersonalSetting'))
      .catch(() => { });
  }

  render() {
    const { selectedItem, itemList } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Change Weight
        </Text>
        {Platform.OS === 'ios'
          ? (
            <PickerIOS
              style={{
                marginTop: 20, alignSelf: 'center', width: '100%', height: 180, backgroundColor: '#dcdcdc',
              }}
              selectedValue={selectedItem}
              itemStyle={{ color: 'black', fontSize: 26 }}
              onValueChange={index => this.onPickerSelect(index)}
            >
              {itemList.map((value, i) => (
                <PickerItemIOS
                  key={`number${value.toString()}`}
                  value={i}
                  label={value.toString()}
                />
              ))}
            </PickerIOS>
          )
          : (
            <Picker
              style={styles.picker}
              selectedValue={selectedItem}
              itemStyle={{ color: 'black', fontSize: 26 }}
              onValueChange={index => this.onPickerSelect(index)}
            >
              {itemList.map((value, i) => (
                <PickerItem label={value.toString()} value={i} key={`number${value.toString()}`} />
              ))}
            </Picker>
          )}

        <Text style={{
          margin: 20,
          color: '#000000',
          fontSize: 20,
          justifyContent: 'center',
          marginTop: 30,
          alignItems: 'center',
          alignSelf: 'center',
          ...titleFontStyle
        }}
        >
          Selected :
          {' '}
          {itemList[selectedItem]}
          {' '}
          kg
        </Text>

        <TouchableOpacity style={styles.setBmiBtn} onPress={this.onAddItem}>
          <Text style={styles.textWhite}>{'Set Weight'.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const titleFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#f7f8f9',
    backgroundColor: 'white'
  },
  setBmiBtn: {
    backgroundColor: '#41ab3e',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 60,
    marginLeft: 60
  },
  picker: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcdcdc',
    marginTop: 20
  },
  text: {
    margin: 20,
    color: '#000000',
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  textWhite: {
    color: '#ffffff',
    fontSize: 15,
    ...regularButtonFont
  },
  welcome: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    color: 'black',
    ...titleFontStyle
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WeightChange);
