
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import FadeInView from '../../assets/animations/FadeInView';
import {
  updateCurrentQuestion,
  updateQuestions,
  isNextQuestionLoading,
  updateAssessmentId,
  updateCurrentAnswerId
} from '../../store/actions/index';
import { fontMaker, regularButtonFont } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  currentQuestion: state.Assessment.currentQuestion,
  questions: state.Assessment.questions,
  assessmentId: state.Assessment.assessmentId,
  currentFlow: state.Assessment.currentFlow,
  UserName: state.User.name,
  currentAssessment: state.Assessment.currentAssessment,
  dob: state.User.dob,
  currentAnswerId: state.Assessment.currentAnswerId
});

const mapDispatchToProps = dispatch => ({
  goToQuestion: question => dispatch(updateCurrentQuestion(question)),
  getAllQuestion: questions => dispatch(updateQuestions(questions)),
  loadingNextQuestion: isLoading => dispatch(isNextQuestionLoading(isLoading)),
  updatedAssessmentId: id => dispatch(updateAssessmentId(id)),
  updatedCurrentAnswerId: id => dispatch(updateCurrentAnswerId(id)),
  addReward: reward => dispatch({
    type: 'RewardReducer_AddReward',
    payload: reward
  }),
  congratulate: value => dispatch({
    type: 'RewardReducer_Congratulate',
    payload: value
  }),
  openRewardModal: value => dispatch({
    type: 'RewardReducer_RewardModalVisible',
    payload: value
  })
});

class AnswerSection extends Component {
  constructor(props) {
    super(props);
    const { currentQuestion } = this.props;
    this.state = {
      // optionAnswer: currentQuestion.options,
      totalOptions: currentQuestion.options.length
    };
  }

  componentWillMount() {
    const { currentQuestion, toggle } = this.props;
    if (currentQuestion.selectedIndex !== null) {
      toggle(false);
    } else if (currentQuestion.options.filter(option => option.checked).length > 0) {
      toggle(false);
    }
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

  selectAnswer = (index) => {
    const { selectAnswer } = this.props;
    selectAnswer(index);
  }

  uncheckBoxes = () => {
    const { currentQuestion } = this.props;
    // const { optionAnswer } = currentQuestion;
    for (const item of currentQuestion.options) {
      if (!item.nonOfTheseOption && item.checked) { item.checked = !item.checked; }
    }
  }

  buttonDisable = () => {
    const { currentQuestion, toggle } = this.props;
    let found = 0;
    // const { optionAnswer } = this.state;
    for (const item of currentQuestion.options) {
      if (item.checked) {
        toggle(false);
        found = 1;
      }
    }
    if (found === 0) {
      toggle(true);
    }
  }

  selectCheckBox = (index) => {
    const { currentQuestion } = this.props;
    // const { optionAnswer } = this.state;
    currentQuestion.options[index].checked = !currentQuestion.options[index].checked;
    // currentQuestion.options[index].checked ? toggle(false) : toggle(true);
    const optionSelected = currentQuestion.options[index];
    this.setState(prevState => ({ currentQuestion: prevState.currentQuestion }));

    if (optionSelected.checked && optionSelected.nonOfTheseOption) {
      this.uncheckBoxes();
    } else {
      for (const item of currentQuestion.options) {
        if (item.nonOfTheseOption) { item.checked = false; }
      }
    }
    this.setState(prevState => ({ currentQuestion: prevState.currentQuestion }));
    this.buttonDisable();
  }

  render() {
    const { totalOptions } = this.state;
    const { currentQuestion, toggle } = this.props;
    return (
      <ScrollView>
        {totalOptions > 4 && currentQuestion.ansType === 'multiple'
          ? <Text style={styles.multipleOptiontext}>This question contains multiple options</Text> : null}
        {/* {currentQuestion.selectedIndex !== null ? toggle(false) : null} */}
        {this.buttonDisable()}
        <View style={styles.optionView}>
          {
            (currentQuestion.ansType === 'single')
              ? (
                <RadioGroup
                  size={24}
                  thickness={2}
                  color="#bfbfbf"
                  highlightColor="#f5f5f5"
                  activeColor="#41ab3e"
                  selectedIndex={currentQuestion.selectedIndex}
                  onSelect={index => this.selectAnswer(index)}
                >
                  {currentQuestion.options.map((x, i) => (
                    <RadioButton style={styles.radio} key={x.weightage} value={x.weightage}>
                      <FadeInView durations={500} delays={i * 100 + 200}>
                        <Text style={styles.labeltext}>{x.label}</Text>
                      </FadeInView>
                    </RadioButton>
                  ))}
                </RadioGroup>
              )
              : currentQuestion.options.map((x, i) => (
                <View style={styles.checkbox}>
                  <CheckBox
                    key={x.no}
                    title={x.label}
                    checked={x.checked}
                    onPress={() => this.selectCheckBox(i)}
                    containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
                    checkedColor="#41ab3e"
                    size={35}
                    textStyle={
                      {
                        fontSize: 14,
                        color: '#070f15',
                        fontWeight: 'normal',
                        ...answerFontStyle,
                        flex: 1
                      }
                    }
                  />
                </View>

              ))
          }
        </View>
      </ScrollView>
    );
  }
}
const noteFontStyle = fontMaker({ family: 'OpenSans', weight: 'Light' });
const answerFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const answerCardStyle = {
  borderWidth: 0.15,
  backgroundColor: 'white',
  borderRadius: 5,
  borderColor: 'transparent'
};
const styles = StyleSheet.create({
  optionView: {
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  radio: {
    padding: 18,
    marginVertical: 5,
    margin: 2,
    ...answerCardStyle
  },
  checkbox: {
    padding: 3,
    marginVertical: 5,
    margin: 2,
    ...answerCardStyle
  },
  labeltext: {
    ...answerFontStyle,
    fontSize: 16,
    marginLeft: 10,
    color: '#070f15'
  },
  multipleOptiontext: {
    color: '#b71c1c',
    textAlign: 'right',
    paddingRight: 12,
    ...noteFontStyle
  },
  moreButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    width: 150,
  },
  lessOptionsBtn: {
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    width: 150,
  },
  nextButton: {
    backgroundColor: '#2980b9',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 10,
    width: 100,
  },
  nextButtonCenter: {
    backgroundColor: '#2980b9',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 60,
    marginRight: 60,
    marginBottom: 10,
  },
  whiteText: {
    color: '#fff',
    ...regularButtonFont
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AnswerSection);
