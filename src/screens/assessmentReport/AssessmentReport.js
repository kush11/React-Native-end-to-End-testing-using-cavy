import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, BackHandler,
} from 'react-native';
import {
  Container, Content, Header, Body, Title, Text
} from 'native-base';
import { connect } from 'react-redux';
import { BarIndicator } from 'react-native-indicators';
import OverallScore from './OverallScore';
import OverallPeerScore from './OverallPeerScore';
import Observations from './Observations';
import ActionPlan from './ActionPlan';
import updateAssessmentReport from '../../store/actions/report';
import { updateCurrentFlow } from '../../store/actions/assessment';
import GetAssessmentReportService from '../../api/assessment/AssessmentReportService';
import { fontMaker, regularButtonFont } from '../../components/utility/fonts/FontMaker';
import ReportLoading from '../../screens/assessmentReport/ReportLoading';

const mapStateToProps = state => ({
  assessmentId: state.Assessment.assessmentId,
  currentAssessment: state.Assessment.currentAssessment
});

const mapDispatchToProps = dispatch => ({
  getReport: data => dispatch(updateAssessmentReport(data)),
  updatedCurrentFlow: data => dispatch(updateCurrentFlow(data)),

});

class AssessmentReport extends React.Component {
  constructor(props) {
    super(props);
    this.backHandle = this._backHandle.bind(this);
    this._didFocusSubscription = props.navigation.addListener('didFocus', () => BackHandler.addEventListener('hardwareBackPress', this.backHandle));
  }

  state = {
    score: 40.35,
    peerScore: 45.67,
    observations: [],
    goalsSuggestion: [],
    spinner: true,
    isModalVisible: false
  };

  componentDidMount() {
    const { assessmentId, navigation } = this.props;
    const id = assessmentId;
    GetAssessmentReportService.fetchAssessmentReport(id)
      .then((responseJson) => {
        try {
          this.setState({
            score: responseJson.finalScore,
            peerScore: responseJson.peerScore
          });
          const observations = [];
          const lowObservations = [];
          const highObservations = [];
          for (const obs of responseJson.themeReportData) {
            if (obs.score === 'Low') {
              obs.type = 'danger';
              for (const label of obs.keywords) {
                lowObservations.push({
                  text: label.label,
                  type: obs.type
                });
              }
            } else {
              obs.type = 'normal';
              for (const label of obs.keywords) {
                highObservations.push({
                  text: label.label,
                  type: obs.type
                });
              }
            }
          }
          observations.push(...highObservations);
          observations.push(...lowObservations);
          this.setState({ observations });
          this.setState({ goalsSuggestion: responseJson.goalsSuggestion });
          this.setState({ spinner: false });
        } catch (ex) {
          // console.error(ex);
        }
      })
      .catch(() => { });

    this._willBlurSubscription = navigation.addListener('willBlur', () => BackHandler.removeEventListener('hardwareBackPress', this.backHandle));
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
  }

  _backHandle = () => {
    const { navigation } = this.props;
    navigation.navigate('Overview');
    return true;
  }

  goToDashboard = () => {
    const { navigation, updatedCurrentFlow } = this.props;
    updatedCurrentFlow('REGISTERED');
    navigation.navigate('Overview');
  }

  toggleModal = () => {
    this.setState(prevState => ({ isModalVisible: !prevState.isModalVisible }));
  }

  render() {
    const {
      spinner,
      score,
      peerScore,
      observations,
      goalsSuggestion,
      isModalVisible
    } = this.state;
    const { currentAssessment } = this.props;
    if (spinner) {
      return (
        <Container>
          {
            <Header style={{ backgroundColor: 'white' }}>
              <Body marginLeft={5}>
                <Title style={{
                  justifyContent: 'center', alignContent: 'center', alignItems: 'center', color: '#144E76', ...reportTitleFontStyle
                }}
                >
                  {' '}
                  {currentAssessment}
                  {' '}
                  Report
                  {' '}
                </Title>
              </Body>
            </Header>}
          <View style={{
            backgroundColor: 'transparent', position: 'absolute', top: 55, bottom: 0, left: 0, right: 0
          }}
          >
            {/* <BarIndicator color="#41ab3e" style={{ marginTop: '0%' }} count={5} /> */}
            <ReportLoading />
          </View>
        </Container>
      );
    }

    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: 'white' }}>
          <Body marginLeft={5}>
            <Title style={{
              justifyContent: 'center', alignContent: 'center', alignItems: 'center', color: '#144E76', ...reportTitleFontStyle
            }}
            >
              {' '}
              {currentAssessment}
              {' '}
              Report
              {' '}
            </Title>
          </Body>
        </Header>
        <Content style={{ backgroundColor: '#f7f7f7' }}>
          <OverallScore value={score} />
          <OverallPeerScore value={peerScore} toggleModal={this.toggleModal} modalVisible={isModalVisible} />
          <Observations observations={observations} />
          <ActionPlan goalsSuggestion={goalsSuggestion} />
          {/* <ExpertSuggestions /> */}
          {/* <NavigationSection /> */}
          <View style={{ padding: 10 }}>
            <TouchableOpacity style={styles.HomeBtn} onPress={this.goToDashboard}>
              <Text style={styles.whiteText}>{'Wellness Home'.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const reportTitleFontStyle = fontMaker({ family: 'OpenSans', weight: 'SemiBold' });
const styles = StyleSheet.create({
  container: { flex: 1, },
  HomeBtn: {
    backgroundColor: '#2980b9',
    marginHorizontal: 10,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 8,
    marginLeft: 60,
    marginRight: 60
  },
  whiteText: {
    color: 'white',
    ...regularButtonFont
  },
  loginLogo: {
    marginTop: 10,
    marginBottom: 20
  },
  sliderContainer: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentReport);
