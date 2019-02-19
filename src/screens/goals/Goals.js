import React, { Component } from 'react';
import {
  View, StyleSheet, Text, AsyncStorage, ScrollView
} from 'react-native';
import { Container } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/FontAwesome';
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import Panel from './Panel';
import BottomZulTabs from '../../components/ui/navigation/BottomZulTabs';
import ActivityList from './ActivityList';
import { BASE_URL, headers } from '../../api/config/Config';


class Goals extends Component {
  constructor(props) {
    super(props);
    // const data = [
    //   { 'title': 'Sweat It out', 'content': '7:00AM Run 5 KM', 'daysLeft': '20 days left' },
    //   { 'title': 'Improve Immune', 'content': '8:00AM Run 5 KM', 'daysLeft': '30 days left' },
    //   { 'title': 'Improve Immune', 'content': '8:00AM Run 5 KM', 'daysLeft': '10 days left' },
    //   { 'title': 'Improve Immune', 'content': '8:00AM Run 5 KM', 'daysLeft': '5 days left' }
    // ];
    this.state = {
      caloriesBurned: '',
      stepsCount: '',
      heartRate: '',
      distance: '',
      googleToken: '',
      goalsList: []
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const dateVal = new Date();
    const dateValYesterday = new Date();
    dateValYesterday.setHours(0, 0, 0, 0);
    const myEpoch1 = Math.floor(dateVal.getTime());
    const myEpoch2 = Math.floor(dateValYesterday.getTime());

    AsyncStorage.getItem('googleToken', (err, result) => {
      this.setState({ googleToken: result });
      this.googleFitRestApi(myEpoch1, myEpoch2);
    });
    this._didFocusSubscription = navigation.addListener('didFocus', () => this.googleFitRestApi(myEpoch1, myEpoch2));

    fetch(`${BASE_URL}/api/goal/userGoals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userName: 'Satya' })
    }).then(response => response.json())
      .then(responseJson => this.setState({ goalsList: responseJson }));
    console.log("data:", this.state.goalsList);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._willBlurSubscription = navigation.addListener('willBlur', () => {
      this.setState({
        caloriesBurned: '',
        stepsCount: '',
        heartRate: '',
        distance: ''
      });
    });
  }

  componentWillUnmount() {
    this._willBlurSubscription && this._willBlurSubscription.remove();
    this._didFocusSubscription && this._didFocusSubscription.remove();
  }

  fetchCall = (userobject, str2) => {
    let fpval = 0;
    let intval = 0;
    fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: str2
      },
      body: JSON.stringify(userobject)
    }).then(response => response.json())
      .then((responseJson) => {
        console.log('res', responseJson);
        if (responseJson.hasOwnProperty.call(responseJson, 'error')) {
          console.log('error from server side:');
        } else if (responseJson.bucket.length > 0) {
          for (let i = 0; i < responseJson.bucket.length; i += 1) {
            if (responseJson.bucket[i].dataset[0].point.length > 0) {
              if (responseJson.bucket[i].dataset[0].point[0].value[0].hasOwnProperty.call(responseJson.bucket[i].dataset[0].point[0].value[0], 'fpVal')) {
                // console.log('Recieved Data', responseJson.bucket[responseJson.bucket.length - 1].dataset[0].point[0].value[0].fpVal);
                fpval += responseJson.bucket[i].dataset[0].point[0].value[0].fpVal;
              } else if (responseJson.bucket[responseJson.bucket.length - 1].dataset[0].point[0].value[0].hasOwnProperty.call(responseJson.bucket[responseJson.bucket.length - 1].dataset[0].point[0].value[0], 'intVal')) {
                // console.log('Recieved Data', responseJson.bucket[responseJson.bucket.length - 1].dataset[0].point[0].value[0].intVal);
                intval += responseJson.bucket[i].dataset[0].point[0].value[0].intVal;
              }
            }
          }
          if (responseJson.bucket[0].dataset[0].dataSourceId === 'derived:com.google.heart_rate.summary:com.google.android.gms:aggregated') {
            this.setState({ heartRate: Math.round(fpval.toFixed(2)) });
          } else if (responseJson.bucket[0].dataset[0].dataSourceId === 'derived:com.google.step_count.delta:com.google.android.gms:aggregated') {
            this.setState({ stepsCount: intval });
          } else if (responseJson.bucket[0].dataset[0].dataSourceId === 'derived:com.google.calories.expended:com.google.android.gms:aggregated') {
            this.setState({ caloriesBurned: fpval.toFixed(2) });
          } else if (responseJson.bucket[0].dataset[0].dataSourceId === 'derived:com.google.distance.delta:com.google.android.gms:aggregated') {
            this.setState({ distance: (fpval / 1000).toFixed(2) });
          }
        } else {
          console.log('no values exists');
        }
      });
  }

  googleFitRestApi = async (myEpoch1, myEpoch2) => {
    const { googleToken } = this.state;
    const str1 = 'Bearer ';
    const str2 = str1.concat(googleToken);
    const dataType = [
      'com.google.step_count.delta',
      'com.google.distance.delta',
      'com.google.heart_rate.bpm',
      'com.google.calories.expended'
    ];
    for (let count = 0; count < dataType.length; count += 1) {
      const userobject = {
        aggregateBy: [{ dataTypeName: dataType[count] }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: myEpoch2,
        endTimeMillis: myEpoch1
      };
      /* eslint-disable no-await-in-loop */
      await this.fetchCall(userobject, str2);
      /* eslint-enable no-await-in-loop */
    }
  }

  render() {
    const {
      stepsCount, caloriesBurned, heartRate, distance, goalsList
    } = this.state;
    const { navigation } = this.props;
    console.log("data from state:", this.state.goalsList);
    if (goalsList.length > 0) {
      return (
        <Container>
          <View style={styles.container}>
            <View>
              <View style={{ flex: 1, flexDirection: 'row', marginBottom: '30%' }}>
                <View style={{ flex: 1, height: 150, }}>
                  <View style={styles.flexBody}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={styles.innerFlexBody}>
                        <Icon name="running" size={40} color="grey" />
                      </View>
                      <View style={styles.innerFlexBody}>
                        <Text style={styles.textStyle}>{stepsCount} steps</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.flexBody}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={styles.innerFlexBody}>
                        <Icon name="heartbeat" size={40} color="grey" />
                      </View>
                      <View style={styles.innerFlexBody}>
                        <Text style={styles.textStyle}>{heartRate} BMP</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1, height: 150 }}>
                  <View style={styles.flexBody}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={styles.innerFlexBody}>
                        <Icon name="burn" size={40} color="grey" />
                      </View>
                      <View style={styles.innerFlexBody}>
                        <Text style={styles.textStyle}>{caloriesBurned} Cal</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.flexBody}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={styles.innerFlexBody}>
                        <Icons name="road" size={40} color="grey" />
                      </View>
                      <View style={styles.innerFlexBody}>
                        <Text style={styles.textStyle}>{distance} km</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* <ScrollView style={{ marginTop: 50 }}>
              {goalsList.map(data => (
                <Panel title={data.title} daysLeft={data.daysLeft} activityLength={data.activities.length}>
                  {
                    data.activities.map(activities => (
                      <ActivityList content={activities.activityTitle} />
                    ))
                  }
                </Panel>
              ))}
            </ScrollView> */}
          </View>
          <View>
            <BottomZulTabs navigator={navigation} activeTab="goals" />
          </View>
        </Container>
      );
    }
    return (
      <View>
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: '30%' }}>
          <View style={{ flex: 1, height: 150, }}>
            <View style={styles.flexBody}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.innerFlexBody}>
                  <Icon name="running" size={40} color="grey" />
                </View>
                <View style={styles.innerFlexBody}>
                  <Text style={styles.textStyle}>{stepsCount} steps</Text>
                </View>
              </View>
            </View>
            <View style={styles.flexBody}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.innerFlexBody}>
                  <Icon name="heartbeat" size={40} color="grey" />
                </View>
                <View style={styles.innerFlexBody}>
                  <Text style={styles.textStyle}>{heartRate} BMP</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, height: 150 }}>
            <View style={styles.flexBody}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.innerFlexBody}>
                  <Icon name="burn" size={40} color="grey" />
                </View>
                <View style={styles.innerFlexBody}>
                  <Text style={styles.textStyle}>{caloriesBurned} Cal</Text>
                </View>
              </View>
            </View>
            <View style={styles.flexBody}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.innerFlexBody}>
                  <Icons name="road" size={40} color="grey" />
                </View>
                <View style={styles.innerFlexBody}>
                  <Text style={styles.textStyle}>{distance} km</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
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
  textStyle: {
    fontSize: 14,
    color: 'grey',
    alignSelf: 'center',
    ...valueFontStyle
  },
  flexBody: {
    flex: 1,
    borderRadius: 5,
    elevation: 5,
    borderWidth: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'transparent',
    shadowOffset: { width: 4, height: 4 },
    shadowColor: '#90a4ae',
    shadowOpacity: 5.0
  },
  innerFlexBody: {
    flex: 1,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center'
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

export default Goals;
