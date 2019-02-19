import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Alert
} from 'react-native';
import { ActionSheet, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import moment from 'moment';
import TutorialModal from './TutorialModal';
import {
  updateCurrentQuestion, isNextQuestionLoading, updateAssessmentId, updateCurrentAnswerId
} from '../../store/actions/index';
import ReportAssessmentDialog from './ReportQuestion';
import themeCode from '../../components/utility/assessment/themeCodes';
import { BASE_URL, headers } from '../../api/config/Config';

let BUTTONS = [
  { text: 'Give feedback on this question', icon: 'flag' },
  { text: 'Quit the assessment', icon: 'md-exit' },
  { text: 'Cancel', icon: 'close' }
];

let DESTRUCTIVE_INDEX = 2;
let CANCEL_INDEX = 3;

const mapStateToProps = state => ({
  currentQuestion: state.Assessment.currentQuestion,
  questions: state.Assessment.questions,
  currentFlow: state.Assessment.currentFlow,
  UserName: state.User.name,
  currentAssessment: state.Assessment.currentAssessment,
  dob: state.User.dob,
  currentAnswerId: state.Assessment.currentAnswerId
});

const mapDispatchToProps = dispatch => ({
  goToQuestion: question => dispatch(updateCurrentQuestion(question)),
  loadingNextQuestion: isLoading => dispatch(isNextQuestionLoading(isLoading)),
  updatedAssessmentId: id => dispatch(updateAssessmentId(id)),
  updatedCurrentAnswerId: id => dispatch(updateCurrentAnswerId(id)),
  openTutorialModal: () => dispatch({
    type: 'TutorialReducer_TutorialVisible',
    payload: true
  }),
  closeCommentModal: () => dispatch({
    type: 'CommentReducer_ShowComment',
    payload: true
  })
});


class FooterSection extends Component {
  constructor() {
    super();
    this.state = {
      iconColor: '#000000',
      reportQuestionVisible: false
    };
  }

  componentDidMount() {
    // TODO: Remove the condition once the save for letter from unregirested id is implemented
    const { currentFlow } = this.props;
    if (currentFlow === 'REGISTERED') {
      BUTTONS = [
        { text: 'Save for later', icon: 'bookmark' },
        { text: 'Give feedback on this question', icon: 'flag' },
        { text: 'Quit the assessment', icon: 'md-exit' },
        { text: 'Cancel', icon: 'close' }
      ];
      DESTRUCTIVE_INDEX = 3;
      CANCEL_INDEX = 4;
    } else {
      BUTTONS = [
        { text: 'Give feedback on this question', icon: 'flag' },
        { text: 'Quit the assessment', icon: 'md-exit' },
        { text: 'Cancel', icon: 'close' }
      ];
    }
  }


  iconClickHandler = () => {
    this.setState(prevState => ({ iconColor: prevState.iconColor === '#000000' ? '#ff0000' : '#000000' }));
  }

  goToNextQuestion = () => {
    const {
      loadingNextQuestion, goToQuestion, questions, currentQuestion
    } = this.props;
    setTimeout(() => {
      loadingNextQuestion(true);
      setTimeout(() => {
        goToQuestion(questions[currentQuestion.no]);
        loadingNextQuestion(false);
      }, 200);
    }, 500);
  }

  showReportQuestionDialog = () => {
    this.setState({ reportQuestionVisible: true });
  }

  hideReportQuestionDialog = () => {
    this.setState({ reportQuestionVisible: false });
  }

  getAnsweredQuestions = (data, drafted = 'completed') => {
    const answeredQuestions = [];
    const {
      currentAnswerId, UserName, currentAssessment, dob
    } = this.props;
    for (let i = 0; i < data.length; i += 1) {
      const answerObj = {};
      const q = data[i];
      answerObj.ansType = q.ansType;
      answerObj.questionId = q._id;
      answerObj.answers = [];
      try {
        if (q.ansType === 'multiple') {
          const checkedOptions = q.options.filter(option => option.checked);
          for (let j = 0; j < checkedOptions.length; j += 1) {
            const multipleOptionObj = {};
            multipleOptionObj.answerDescription = checkedOptions[j].label;
            multipleOptionObj.answerIndex = checkedOptions[j].no;
            multipleOptionObj.weightage = checkedOptions[j].weightage;
            multipleOptionObj.answerScore = checkedOptions[j].answerScore;
            // Pushing the Object to options List
            answerObj.answers.push(multipleOptionObj);
          }
        } else if (q.ansType === 'single') {
          const singleOptionObj = {};
          if (q.selectedIndex) {
            singleOptionObj.answerDescription = q.options[q.selectedIndex].label;
            singleOptionObj.answerIndex = q.options[q.selectedIndex].no;
            singleOptionObj.weightage = q.options[q.selectedIndex].weightage;
            singleOptionObj.answerScore = q.options[q.selectedIndex].answerScore;
            // Pushing the Object to options List
            answerObj.answers.push(singleOptionObj);
          }
        }
      } catch (error) {
        Toast.show({
          text: error,
          duration: 2000,
          type: 'default'
        });
      }
      answeredQuestions.push(answerObj);
    }
    const obj = {
      _id: currentAnswerId,
      answerId: null,
      userName: UserName,
      theme: currentAssessment,
      date: this.getCurrentDate(),
      options: answeredQuestions,
      themeCode: themeCode(currentAssessment),
      drafted,
      dob: dob ? moment(dob).format('MM-DD-YYYY') : null
    };
    return obj;
  }

  getCurrentDate = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }
    today = `${mm}/${dd}/${yyyy}`;
    return today;
  }

  // TODO: move redundant methods of footer section and answer section in single utility
  getReport = (data, drafted) => {
    const reqData = this.getAnsweredQuestions(data, drafted);
    const { goToDashboard, updatedAssessmentId, updatedCurrentAnswerId } = this.props;
    fetch(`${BASE_URL}/api/answer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reqData)
    }).then(response => response.json())
      .then((responseJson) => {
        if (responseJson !== null && responseJson !== 'undefined') {
          if (responseJson.id !== null) {
            updatedAssessmentId(responseJson.id);
            updatedCurrentAnswerId(null);
            goToDashboard();
          }
        }
      })
      .catch((error) => {
        Toast.show({
          text: error,
          duration: 2000,
          type: 'default'
        });
      });
  }

  render() {
    const { quitAssessment, questions } = this.props;
    const { reportQuestionVisible } = this.state;
    return (

      <View style={styles.container}>
        <View style={styles.comment}>
          <TouchableOpacity style={styles.btn}>
            <Text />
          </TouchableOpacity>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => ActionSheet.show(
              {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,

              },
              (buttonIndex) => {
                if (buttonIndex < CANCEL_INDEX) {
                  // this.setState({ clicked: BUTTONS[buttonIndex] });
                  if (BUTTONS[buttonIndex].text === 'Quit the assessment') {
                    Alert.alert(
                      'Quit Assessment',
                      'Do you want to quit the assessment?',
                      [
                        { text: 'No', onPress: () => { }, style: 'cancel' },
                        { text: 'Yes', onPress: () => quitAssessment() },
                      ],
                      { cancelable: false }
                    );
                  } else if (BUTTONS[buttonIndex].text === 'Give feedback on this question') {
                    this.setState({ reportQuestionVisible: true });
                  } else if (BUTTONS[buttonIndex].text === 'Save for later') {
                    Alert.alert(
                      'Save Assessment',
                      'Do you want to save the assessment and submit it later?',
                      [

                        {
                          text: 'Yes',
                          onPress: () => {
                            this.getReport(questions, 'drafted');
                          }
                        },
                      ],
                      { cancelable: true }
                    );
                  }
                }
              }
            )}
          >
            <Icon name="ellipsis-v" size={25} color="#000000" />
          </TouchableOpacity>
        </View>
        <TutorialModal />
        <ReportAssessmentDialog visible={reportQuestionVisible} showReportQuestionDialog={this.showReportQuestionDialog} hideReportQuestionDialog={this.hideReportQuestionDialog} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterSection);


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 5,
    borderColor: '#ddd',
    borderTopWidth: 1
  },
  comment: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  btn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5
  }
});
