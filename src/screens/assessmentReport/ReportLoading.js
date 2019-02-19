import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text
} from 'react-native';
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import * as Progress from 'react-native-progress';


class ReportLoading extends Component {

  render() {
    return (
      <View style={styles.Container}>
        <View>

          <Image style={styles.imagelogo} source={require('../../assets/images/treeoflife.png')} />
        </View>
        <View>
          <Text style={{
            top: 30, fontSize: 20, textAlign: 'center', color: '#A9A9A9', ...logoTextFontStyle
          }}
          >
            INTERPRETING RESPONSES
            </Text>
        </View>
        <View style={{ top: 70 }}>
          <Progress.Bar progress={0.3} height={8} width={280} color={'#41ab3e'} animationType={'timing'} indeterminate={true} />
        </View>

      </View>
    );
  }
}
const logoTextFontStyle = fontMaker({ family: 'OpenSans', weight: 'Bold' });
const styles = StyleSheet.create({
  Container: {
    position: 'absolute',
    top: 60,
    left: 30,
    right: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagelogo: {
    height: 195,
    width: 172

  }

});
export default ReportLoading;
