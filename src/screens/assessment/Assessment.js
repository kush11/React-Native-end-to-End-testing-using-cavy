import React, { Component } from 'react';
import { Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { swipeDirections } from 'react-native-swipe-gestures';
import Question from './Question';
import {
  exitAssessment, updateCurrentQuestion, updateQuestions, updateCurrentFlow
} from '../../store/actions/index';


const mapStateToProps = state => ({
  currentQuestion: state.Assessment.currentQuestion,
  questions: state.Assessment.questions,
  isNextQuestionLoading: state.Assessment.isNextQuestionLoading,
  currentAssessment: state.Assessment.currentAssessment,
  currentFlow: state.Assessment.currentFlow,
  assessmentId: state.Assessment.assessmentId,
  uName: state.User.name
});

const mapDispatchToProps = dispatch => ({
  goToQuestion: question => dispatch(updateCurrentQuestion(question)),
  getAllQuestion: questions => dispatch(updateQuestions(questions)),
  getCurrentQuestion: question => dispatch(updateCurrentQuestion(question)),
  exitedAssessment: data => dispatch(exitAssessment(data)),
  updatedCurrentFlow: flow => dispatch(updateCurrentFlow(flow))
});

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.exitHandle = this._exitHandle.bind(this);
    this._didFocusSubscription = props.navigation.addListener('didFocus', () => BackHandler.addEventListener('hardwareBackPress', this.exitHandle));
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._willBlurSubscription = navigation.addListener('willBlur', () => BackHandler.removeEventListener('hardwareBackPress', this.exitHandle));
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.exitHandle);
  }

  onSwipe(gestureName) {
    const {
      SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT
    } = swipeDirections;
    const { currentQuestion, questions, goToQuestion } = this.props;
    switch (gestureName) {
      case SWIPE_UP:
        break;
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        if (currentQuestion.no < questions.length) {
          goToQuestion(questions[currentQuestion.no]);
        }
        break;
      case SWIPE_RIGHT:
        if (currentQuestion.no > 1) {
          goToQuestion(questions[currentQuestion.no - 2]);
        }
        break;
      default:
        break;
    }
  }

  exitAlert = () => (
    Alert.alert(
      'Quit Assessment',
      'Do you want to quit the assessment?',
      [
        { text: 'No', onPress: () => { } },
        { text: 'Yes', onPress: () => this.goToStart() },
      ],
      { cancelable: false }
    )

  );

  _exitHandle = () => {
    this.exitAlert();
    return true;
  }

  goToDashboard = () => {
    const { navigation } = this.props;
    navigation.navigate('Overview');
  }

  quitAssessment = () => {
    const { uName, navigation } = this.props;
    if (uName === '' || uName === null) {
      navigation.navigate('StartPage');
    } else {
      navigation.navigate('AssessmentList');
    }
  }

  goToStart = () => {
    const { uName, navigation } = this.props;
    if (uName === '' || uName === null) {
      navigation.navigate('StartPage');
    } else {
      navigation.navigate('AssessmentList');
    }
  }

  goToSignUp = () => {
    const { navigation } = this.props;
    navigation.navigate('Register');
  }

  goToReport = () => {
    const { currentAssessment, navigation } = this.props;
    if (currentAssessment === 'Biological Age') {
      navigation.navigate('BiologicalReport');
    } else {
      navigation.navigate('AssessmentReport');
    }
  }

  goToMinReport = () => {
    const { currentAssessment, navigation } = this.props;
    if (currentAssessment === 'Biological Age') {
      navigation.navigate('LogIn');
    } else {
      navigation.navigate('MinimunReport');
    }
  }

  render() {
    return (
      <Question
        onDismiss={this.onDismiss}
        quitAssessment={this.quitAssessment}
        goToSignUp={this.goToSignUp}
        goToReport={this.goToReport}
        goToDashboard={this.goToDashboard}
        goToMinReport={this.goToMinReport}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Assessment);
