import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Thumbnail, Card } from 'native-base';
import { connect } from 'react-redux';
import StarRating from 'react-native-star-rating';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({ expertList: state.Report.assessmentReport.expertList });

const ProfileCard = ({ profile }) => (
  <Card style={{
    width: 150, paddingVertical: 10, marginHorizontal: 5, alignItems: 'center'
  }}
  >
    <Thumbnail source={profile.profileImage} />
    <Text style={{ marginVertical: 2, color: '#3a3a3a', ...dataFontStyle }}>{profile.name}</Text>
    <Text style={{ fontSize: 12, color: '#3a3a3a', ...dataFontStyle }}>{profile.speciality}</Text>
    <View style={{ flexDirection: 'row' }}>
      <StarRating
        disabled={false}
        maxStars={1}
        rating={1}
        style={{ width: 50 }}
        fullStarColor="#41ab3e"
        starSize={18}
      />
      <Text style={{ color: '#41ab3e' }}>{profile.score}</Text>
    </View>
  </Card>
);

const ExpertSuggestions = ({ expertList }) => (
  <View>
    <Text style={styles.title}>{'Suggested Experts'.toUpperCase()}</Text>
    <ScrollView horizontal>
      {expertList.map((x => <ProfileCard profile={x} key={x} />))}
    </ScrollView>
  </View>
);

const titleFontStyle = fontMaker({ family: 'OpenSans', weight: 'SemiBold' });
const dataFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  title: {
    color: '#495057',
    fontSize: 13,
    paddingTop: 10,
    paddingLeft: 10,
    ...titleFontStyle
  }
});
export default connect(mapStateToProps)(ExpertSuggestions);
