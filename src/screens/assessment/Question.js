import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Toast } from 'native-base';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import QuestionSection from './QuestionSection';
import AnswerSection from './AnswerSection';
import FooterSection from './FooterSection';
import QuestionHeader from './QuestionHeader';
import themeCode from '../../components/utility/assessment/themeCodes';
import {
  updateCurrentQuestion, updateQuestions, isNextQuestionLoading, updateAssessmentId, updateCurrentAnswerId
} from '../../store/actions/index';
import { regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';
import { BASE_URL, headers } from '../../api/config/Config';


const mapStateToProps = state => ({
  currentQuestion: state.Assessment.currentQuestion,
  questions: state.Assessment.questions,
  assessmentId: state.Assessment.assessmentId,
  currentFlow: state.Assessment.currentFlow,
  userName: state.User.name,
  currentAssessment: state.Assessment.currentAssessment,
  dob: state.User.dob,
  currentAnswerId: state.Assessment.currentAnswerId,
  isNextQuestionLoading: state.Assessment.isNextQuestionLoading

});

const mapDispatchToProps = dispatch => ({
  goToQuestion: question => dispatch(updateCurrentQuestion(question)),
  getAllQuestion: questions => dispatch(updateQuestions(questions)),
  loadingNextQuestion: isLoading => dispatch(isNextQuestionLoading(isLoading)),
  updatedAssessmentId: id => dispatch(updateAssessmentId(id)),
  updatedCurrentAnswerId: id => dispatch(updateCurrentAnswerId(id)),
});

export class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sclAlert: false,
      showSCLAlert: false,
      buttonDisable: true,
    };
  }

  getAnsweredQuestions = (data, drafted = 'completed') => {
    const {
      currentAnswerId, userName, currentAssessment, dob
    } = this.props;
    const answeredQuestions = [];
    for (let i = 0; i < data.length; i += 1) {
      const answerObj = {};
      const q = data[i];
      answerObj.ansType = q.ansType;
      answerObj.questionId = q._id;
      answerObj.answers = [];
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
        singleOptionObj.answerDescription = q.options[q.selectedIndex].label;
        singleOptionObj.answerIndex = q.options[q.selectedIndex].no;
        singleOptionObj.weightage = q.options[q.selectedIndex].weightage;
        singleOptionObj.answerScore = q.options[q.selectedIndex].answerScore;

        // Pushing the Object to options List
        answerObj.answers.push(singleOptionObj);
      }
      answeredQuestions.push(answerObj);
    }
    const obj = {
      _id: currentAnswerId,
      answerId: null,
      userName,
      theme: currentAssessment,
      date: this.getCurrentDate(),
      options: answeredQuestions,
      themeCode: themeCode(currentAssessment),
      drafted,
      dob: dob ? moment(dob).format('MM-DD-YYYY') : null
    };
    return obj;
  };

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
  };

  selectAnswer = (index) => {
    const {
      questions, currentQuestion, getAllQuestion, loadingNextQuestion, goToQuestion
    } = this.props;
    if (questions[currentQuestion.no - 1].ansType === 'single') {
      questions[currentQuestion.no - 1].selectedIndex = index;
      questions[currentQuestion.no - 1].options[index].checked = true;
    }
    getAllQuestion(questions);
    let questionIndex = currentQuestion.no;
    if (questionIndex !== questions.length) {
      if (currentQuestion.no >= questions.length) {
        questionIndex -= 1;
      }
      setTimeout(() => {
        loadingNextQuestion(true);
        setTimeout(() => {
          goToQuestion(questions[questionIndex]);
          loadingNextQuestion(false);
        }, 200);
      }, 500);
    } else {
      this.setState({ sclAlert: true });
    }
    this.setState({ buttonDisable: true });
  };

  buttonDisable = (val) => {
    this.setState({ buttonDisable: val });
  }

  handleOpen = () => {
    this.setState({ showSCLAlert: true });
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false });
  };

  handleSclDismiss = () => {
    this.setState({ sclAlert: false });
  };

  handleSclClose = () => {
    const { questions } = this.props;
    this.getReport(questions, 'completed');
    this.setState({ sclAlert: false });
  };

  getReport = (data, drafted) => {
    const {
      currentFlow, goToReport, goToMinReport, updatedAssessmentId, updatedCurrentAnswerId
    } = this.props;
    const reqData = this.getAnsweredQuestions(data, drafted);
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
            if (currentFlow === 'REGISTERED') {
              goToReport();
            } else {
              goToMinReport();
            }
          } else {
            this.setState({ alertTitle: 'Error!, Response is null/undefined or _id is not present' });
            this.handleOpen();
          }
        } else {
          this.setState({ alertTitle: 'Error!, Response is null/undefined' });
          this.handleOpen();
        }
      })
      .catch((error) => {
        Toast.show({
          text: error,
          duration: 2000,
          type: 'default'
        });
      });
  };


  render() {
    const {
      currentQuestion, isNextQuestionLoading, quitAssessment, goToDashboard,
      goToSignUp, goToReport, goToMinReport
    } = this.props;
    const {
      showSCLAlert, alertTitle, sclAlert, buttonDisable
    } = this.state;
    const right = true;
    return (
      <Container>
        <SCLAlert
          theme="danger"
          show={showSCLAlert}
          title="Oops!"
          subtitle={alertTitle}
          cancellable={right}
          onRequestClose={this.handleClose}
          headerContainerStyles={{ backgroundColor: '#41ab3e' }}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton theme="danger" onPress={this.handleClose}>CLOSE</SCLAlertButton>
        </SCLAlert>
        <SCLAlert
          theme="success"
          show={sclAlert}
          title="Thank you!"
          subtitle="Your personalized report is now ready."
          cancellable={right}
          onRequestClose={this.handleSclDismiss}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton theme="success" onPress={this.handleSclClose} textStyle={{ ...regularButtonFont }}>GET YOUR REPORT</SCLAlertButton>
        </SCLAlert>
        <QuestionHeader currentQuestion={currentQuestion} />

        <View style={{ flex: 2 }}>
          <QuestionSection selectAnswer={this.selectAnswer} buttonDisable={buttonDisable} />
        </View>
        <View style={{ flex: 3 }}>
          {!isNextQuestionLoading
            && <AnswerSection
              toggle={this.buttonDisable}
              selectAnswer={this.selectAnswer}
              goToSignUp={goToSignUp}
              goToReport={goToReport}
              goToMinReport={goToMinReport}
            />}
        </View>
        <View>
          <FooterSection quitAssessment={quitAssessment} goToDashboard={goToDashboard} />
        </View>
      </Container>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Question);
