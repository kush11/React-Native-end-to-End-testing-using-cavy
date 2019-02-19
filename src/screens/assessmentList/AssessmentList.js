import React, { Component } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Animated, ScrollView
} from 'react-native';
import {
  List, Text, ListItem, Left, Body, Thumbnail, Right
} from 'native-base';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  updateCurrentAssessment, setAssessmentType, updateQuestions, updateCurrentQuestion,
  updateAssessmentId, updateCurrentAnswerId
} from '../../store/actions/assessment';
import updateAssessmentsList from '../../store/actions/assessmentList';
// import { getLabel } from '../../components/utility/locale/I18N';
import themeCode from '../../components/utility/assessment/themeCodes';
import GetAssessmentListService from '../../api/assessment/GetAssessmentListService';
import { BASE_URL, headers } from '../../api/config/Config';
import BottomZulTabs from '../../components/ui/navigation/BottomZulTabs';
import { fontMaker } from '../../components/utility/fonts/FontMaker';

const mapStateToProps = state => ({
  currentAssessment: state.Assessment.currentAssessment,
  assessmentsList: state.AssessmentList.assessmentsList,
  userName: state.User.name,
  uDob: state.User.dob
});

const mapDispatchToProps = dispatch => ({
  SetAssessmentType: data => dispatch(setAssessmentType(data)),
  updatedAssessmentsList: data => dispatch(updateAssessmentsList(data)),
  getAllQuestion: data => dispatch(updateQuestions(data)),
  getCurrentQuestion: data => dispatch(updateCurrentQuestion(data)),
  updatedAssessmentId: data => dispatch(updateAssessmentId(data)),
  updatedCurrentAnswerId: data => dispatch(updateCurrentAnswerId(data)),
  updatedCurrentAssessment: data => dispatch(updateCurrentAssessment(data))
});

const listItemFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const reportButtonFontStyle = fontMaker({ family: 'Montserrat', weight: 'Bold' });
const noteFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' }); const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    marginTop: 5
  },
  logoutBtn: {
    backgroundColor: '#2980b9',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 120,
    marginRight: 120,
    marginBottom: 10,
  },
  whiteText: { color: '#fff' },
});

const show = (x, selectReport, selectAssessment, selectDraftedAssessment) => {
  let list;
  if (x.drafted === 'completed') {
    list = <ListItem noIndent thumbnail key={x.id} onPress={() => { selectReport(x.title, x.id); }} style={{ paddingVertical: 5 }}>
      <Left>
        <Thumbnail source={x.icon} />
      </Left>
      <Body>
        <Text style={{ color: '#3a3a3a', ...listItemFontStyle }}>{x.title}</Text>
        <Text note style={{ ...noteFontStyle }}>{x.note}</Text>
      </Body>
      <Right>
        <TouchableOpacity onPress={() => selectReport(x.title, x.id)}>
          <Text
            style={{ fontSize: 12, ...reportButtonFontStyle }}
            accessible
            accessibilityLabel="View Report"
            accessibilityHint="View Assesssment report"
          >
            {'View Report'}
          </Text>
        </TouchableOpacity>
      </Right>
    </ListItem>;
  } else if (x.drafted === 'notdrafted') {
    list = <ListItem noIndent thumbnail key={x.id} onPress={() => selectAssessment(x.title)} style={{ paddingVertical: 5 }}>
      <Left>
        <Thumbnail source={x.icon} />
      </Left>
      <Body>
        <Text style={{ color: '#3a3a3a', ...listItemFontStyle }}>{x.title}</Text>
        <Text style={{ color: '#b71c1c', ...noteFontStyle }} note>{x.note}</Text>
      </Body>
      <Right>
        <TouchableOpacity onPress={() => selectAssessment(x.title)}>
          <Icon name="arrow-right" />
        </TouchableOpacity>
      </Right>
    </ListItem>;
  } else if (x.drafted === 'drafted') {
    list =
      <ListItem noIndent thumbnail key={x.id} onPress={() => selectDraftedAssessment(x.title, x.id)} style={{ paddingVertical: 5 }}>
        <Left>
          <Thumbnail source={x.icon} />
        </Left>
        <Body>
          <Text style={{ color: '#3a3a3a', ...listItemFontStyle }}>{x.title}</Text>
          <Text style={{ color: '#b71c1c', ...noteFontStyle }} note>Saved for later</Text>
        </Body>
        <Right>
          <TouchableOpacity onPress={() => selectDraftedAssessment(x.title, x.id)}>
            <Icon name="arrow-right" />
          </TouchableOpacity>
        </Right>
      </ListItem>;
  }
  return list;
};
const Page = ({
  assessments, selectReport, selectAssessment, selectDraftedAssessment
}) => (
    <ScrollView style={styles.container}>
      <View style={{ backgroundColor: '#ffffff' }}>
        <List>
          {assessments.map(x => (
            show(x, selectReport, selectAssessment, selectDraftedAssessment)
          ))}
        </List>
      </View>
    </ScrollView>
  );


const Tab = ({
  tab, page, onPressHandler, onTabLayout
}) => {
  const { label } = tab;
  const style = {
    marginHorizontal: 20,
    paddingVertical: 10,
  };
  const containerStyle = {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: styles.backgroundColor,
    opacity: styles.opacity,
    transform: [{ scale: styles.opacity }],
  };
  const textStyle = {
    color: styles.textColor,
    fontWeight: '600',
  };
  return (
    <TouchableOpacity style={style} onPress={onPressHandler} onLayout={onTabLayout} key={page}>
      <Animated.View style={containerStyle}>
        <Animated.Text style={textStyle}>{label}</Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

class AssessmentList extends Component {
  _scrollX = new Animated.Value(0);

  interpolators = Array.from({ length: 9 }, (_, i) => i).map(idx => ({
    scale: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp',
    }),
    opacity: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    }),
    textColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#3a3a3a', '#fff', '#3a3a3a'],
    }),
    backgroundColor: this._scrollX.interpolate({
      inputRange: [idx - 1, idx, idx + 1],
      outputRange: ['#fff', '#3f51b5', '#fff'],
      extrapolate: 'clamp',
    }),
  }));

  constructor(props) {
    super(props);
    this.state = { assessmentsLocal: null };
  }

  componentWillMount() {
    const { navigation } = this.props;
    this._didFocusSubscription = navigation.addListener('didFocus', () => this.updateAssessments());
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._willBlurSubscription = navigation.addListener('willBlur', () => this.setState({ assessmentsLocal: null }));
  }

  componentWillUnmount() {
    this._willBlurSubscription && this._willBlurSubscription.remove();
    this._didFocusSubscription && this._didFocusSubscription.remove();
  }

  // 6 is a quantity of tabs

  logout = () => {
    const { navigation } = this.props;
    navigation.navigate('LogIn');
  }

  updateAssessments = () => {
    const { userName, updatedAssessmentsList } = this.props;
    const reqData = { userName };
    let assessmentsList = [];
    /* FETCH CALL TO GET ALL THE ASSESSMENTS */
    GetAssessmentListService.fetchAssessmentList(reqData)
      .then((responseJson) => {
        assessmentsList = responseJson;
        for (let i = 0; i < assessmentsList.length; i += 1) {
          switch (assessmentsList[i].title) {
            case 'Wholesomeness':
              assessmentsList[i].icon = { uri: 'https://zultestimageapi.herokuapp.com/image/Wholesomeness.jpg' };
              break;
            case 'Diet Score':
              assessmentsList[i].icon = { uri: 'https://zultestimageapi.herokuapp.com/image/Nutrition.jpg' };
              break;
            case 'Thought Control':
              assessmentsList[i].icon = { uri: 'https://zultestimageapi.herokuapp.com/image/Thought control overview screen.png' };
              break;
            case 'Zest For Life':
              assessmentsList[i].icon = { uri: 'https://zultestimageapi.herokuapp.com/image/ZestforLife.jpg' };
              break;
            case 'Strength & Energy':
              assessmentsList[i].icon = { uri: 'https://zultestimageapi.herokuapp.com/image/prevention-wellness.png' };
              break;
            case 'Relationship & Intimacy':
              assessmentsList[i].icon = { uri: 'https://zultestimageapi.herokuapp.com/image/R&I Overview Screen.jpg' };
              break;
            case 'Biological Age':
              assessmentsList[i].icon = { uri: 'https://zulimageapi.herokuapp.com/image/A10022-min.jpg' };
              break;
            default:
              break;
          }
        }
        updatedAssessmentsList(assessmentsList);
        this.setState({ assessmentsLocal: assessmentsList });
      })
      .catch(() => { });
  }

  selectReport = (title, id) => {
    const { navigation, updatedAssessmentId, updatedCurrentAssessment } = this.props;
    updatedAssessmentId(id);
    updatedCurrentAssessment(title);
    if (title === 'Biological Age') { navigation.navigate('BiologicalReport'); } else { navigation.navigate('AssessmentReport', { title }); }
  }

  selectAssessment = (data) => {
    const {
      getAllQuestion, getCurrentQuestion, navigation,
      updatedCurrentAnswerId, SetAssessmentType
    } = this.props;
    updatedCurrentAnswerId(null);
    SetAssessmentType(data);
    const requestUrl = `${BASE_URL}/api/theme/question?themeCode=${themeCode(data)}`;
    let questions = [];
    let question = {};
    fetch(requestUrl, {
      method: 'GET',
      headers
    }).then(response => response.json())
      .then((responseJson) => {
        questions = responseJson;
        question = responseJson[0];
        for (let i = 0; i < questions.length; i += 1) {
          questions[i].selectedIndex = null;
          for (let j = 0; j < questions[i].options.length; j += 1) {
            questions[i].options[j].checked = false;
          }
        }
        getAllQuestion(questions);
        getCurrentQuestion(question);
        updatedCurrentAnswerId(null);
        navigation.navigate('AssessmentInfo', { title: data });
      })
      .catch(() => { });
  }

  selectDraftedAssessment = (data, id) => {
    const {
      getAllQuestion, getCurrentQuestion, navigation,
      SetAssessmentType, updatedCurrentAnswerId
    } = this.props;
    updatedCurrentAnswerId(null);
    const reqObject = { id };
    fetch(`${BASE_URL}/api/getAnswer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reqObject)
    }).then(responseOption => responseOption.json())
      .then((responseJsonOption) => {
        const optionAray = responseJsonOption[0];
        SetAssessmentType(data);
        const requestUrl = `${BASE_URL}/api/theme/question?themeCode=${themeCode(data)}`;
        let questions = [];
        let question = {};
        fetch(requestUrl, {
          method: 'GET',
          headers
        }).then(response => response.json())
          .then((responseJson) => {
            questions = responseJson;
            question = responseJson[0];
            for (let i = 0; i < questions.length; i += 1) {
              questions[i].selectedIndex = null;
              for (let j = 0; j < questions[i].options.length; j += 1) {
                questions[i].options[j].checked = false;
              }
            }

            for (let i = 0; i < optionAray.options.length; i += 1) {
              // selected questions
              question = questions[i];
              if (!optionAray.options[i].answers.length) {
                break;
              }
              // Mapping old questions
              for (let j = 0; j < optionAray.options[i].answers.length; j += 1) {
                questions[i].selectedIndex = optionAray.options[i].answers[j].answerIndex - 1;
                if (optionAray.options[i].answers[j].ansType === 'single') {
                  continue;
                }
                for (let k = 0; k < questions[i].options.length; k += 1) {
                  if (questions[i].options[k].checked) {
                    continue;
                  }
                  questions[i].options[k].checked = questions[i].options[k].label === optionAray.options[i].answers[j].answerDescription;
                }
              }
            }
            getAllQuestion(questions);
            getCurrentQuestion(question);
            updatedCurrentAnswerId(id);
            navigation.navigate('Assessment', { title: data });
          })
          .catch(() => { });
      });
  }

  render() {
    // const logoutText = getLabel('home.logout');
    const { navigation } = this.props;
    const { assessmentsLocal } = this.state;
    if (assessmentsLocal !== null) {
      return (
        <View style={[styles.container]}>
          <Page tabLabel={{ label: 'All' }} selectDraftedAssessment={this.selectDraftedAssessment} selectAssessment={this.selectAssessment} selectReport={this.selectReport} assessments={assessmentsLocal} />
          <BottomZulTabs navigator={navigation} activeTab="checks" />
        </View>
      );
    }
    return (null);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentList);
