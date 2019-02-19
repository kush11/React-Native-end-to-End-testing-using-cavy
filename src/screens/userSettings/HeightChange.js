import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity, PickerIOS
} from 'react-native';
import { connect } from 'react-redux';
import Picker from 'react-native-wheel-picker';
import { updateHeight, updateBmi } from '../../store/actions/index';
import { BASE_URL, headers } from '../../api/config/Config';
import CalculateBmi from '../../components/utility/bmi/Bmi';
import { regularButtonFont, fontMaker } from '../../components/utility/fonts/FontMaker';


const PickerItemIOS = PickerIOS.Item;

const mapStateToProps = state => ({
  name1: state.User.name,
  uHeight: state.User.height,
  uWeight: state.User.weight,
});
const mapDispatchToProps = dispatch => ({
  updatedHeight: height => dispatch(updateHeight(height)),
  updatedBmi: bmi => dispatch(updateBmi(bmi))
});
const PickerItem = Picker.Item;

export class HeightChange extends Component {
  constructor(props) {
    super(props);
    const { uHeight } = this.props;
    this.state = {
      selectedItem: uHeight === '' ? 0 : uHeight,
      itemList: []

    };
    const { itemList } = this.state;
    for (let i = 0; i <= 300; i += 1) {
      itemList[i] = i;
    }
  }

  onPickerSelect(index) {
    this.setState({ selectedItem: index });
  }

  onAddItem = () => {
    const {
      name1, uWeight, navigation, updatedHeight, updatedBmi
    } = this.props;
    const { itemList, selectedItem } = this.state;
    fetch(`${BASE_URL}/api/userData`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: name1,
        height: itemList[selectedItem]
      })
    }).then(response => response.json(),
      updatedHeight(itemList[selectedItem]))
      .then(updatedBmi(CalculateBmi(itemList[selectedItem], uWeight)))
      .then(navigation.navigate('PersonalSetting'))
      .catch(() => { });
  }

  render() {
    const { selectedItem, itemList } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Please select
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
              style={{
                width: '100%',
                height: 180,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#eee',
                marginTop: 20
              }}
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
          cm
        </Text>
        <TouchableOpacity style={styles.setBmiBtn} onPress={this.onAddItem}>
          <Text style={styles.textWhite}>{'Set Height'.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const titleFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default connect(mapStateToProps, mapDispatchToProps)(HeightChange);
