import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { fontMaker, defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';


const mapStateToProps = state => ({ score: state.Report.assessmentReport.score });

const OverallPeerScore = (props) => {
  const { value, modalVisible, toggleModal } = props;
  const score = { value };
  return (
    <View>
      <SCLAlert
        theme="info"
        show={modalVisible}
        title="Overall Peer Score"
        subtitle=""
        cancellable
        onRequestClose={toggleModal}
        titleStyle={{ ...defaultModalFont }}
        subtitleStyle={{ ...defaultModalFont }}
      >
        <View style={styles.container}>
          <Text numberOfLines={5} style={styles.subtitle}>
            Peer assessments are scored by criteria.
            The score for each criterion is the median
            (not the average)of the scores that each
            peer assessor gave that criterion.
          </Text>
        </View>
        <SCLAlertButton
          theme="info"
          onPress={toggleModal}
          textStyle={{ ...regularButtonFont }}
        >
          CLOSE
        </SCLAlertButton>
      </SCLAlert>
      <View>
        <Text style={styles.title}>{'Overall Peer Score'.toUpperCase()}</Text>
      </View>
      <View style={{ backgroundColor: '#ffffff', padding: 10, flexDirection: 'row' }}>
        <View style={{ flex: 7, marginLeft: 45, marginTop: 10 }}>
          <AnimatedCircularProgress
            style={{
              alignSelf: 'center',
              borderColor: 'transparent',
              shadowOffset: { width: 4, height: 4 },
              shadowColor: '#90a4ae',
              shadowOpacity: 5.0
            }}
            size={180}
            width={15}
            fill={score.value}
            tintColor="#41ab3e"
            onAnimationComplete={() => { }}
            backgroundColor="#ddd"
          >
            {
              fill => (
                <View>
                  <Text style={{
                    fontSize: 25, textAlign: 'center', color: '#3a3a3a', ...scoreFontStyle
                  }}
                  >
                    {`${score.value}%`}
                  </Text>
                  <Text style={{ fontSize: 25, color: '#3a3a3a' }}>
                    {/* {score.caption} */}
                  </Text>
                </View>
              )
            }
          </AnimatedCircularProgress>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={toggleModal}>
            <Icon name="info" size={25} color="#2980b9" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const titleFontStyle = fontMaker({ family: 'OpenSans', weight: 'SemiBold' });
const scoreFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  title: {
    color: '#495057',
    fontSize: 15,
    padding: 10,
    ...titleFontStyle
  },
  logInBtn: {
    backgroundColor: '#00c497',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
    borderRadius: 8,
    marginRight: 40,
    marginLeft: 40,
  },
  modal: {
    paddingVertical: 180,
    width: 350,
    alignSelf: 'center'
  },
  whiteText: {
    color: '#ffffff',
    fontSize: 15
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555555',
    fontWeight: '300'
  }
});

export default connect(mapStateToProps)(OverallPeerScore);
