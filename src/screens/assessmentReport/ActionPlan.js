import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import { fontMaker } from '../../components/utility/fonts/FontMaker';


const ActionPlan = ({ goalsSuggestion }) => (
  goalsSuggestion && goalsSuggestion.length > 0
    ? (
      <View>
        <Text style={styles.title}>{'Suggested Goals'.toUpperCase()}</Text>
        <View style={{
          flexWrap: 'wrap', alignItems: 'flex-start', flexDirection: 'row', backgroundColor: '#ffffff', padding: 10
        }}
        >
          {goalsSuggestion.map(x => (
            <Text style={[styles.tag, { color: '#00b386' }]} key={x.description}>{x.description}</Text>
          ))}
        </View>
      </View>
    )
    : <View />
);

const titleFontStyle = fontMaker({ family: 'OpenSans', weight: 'SemiBold' });
const tagsFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 14,
    ...tagsFontStyle
  },
  title: {
    color: '#495057',
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    ...titleFontStyle
  }
});

export default ActionPlan;
