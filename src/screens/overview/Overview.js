import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, BackHandler, Alert, ScrollView
} from 'react-native';
import {
  Container, Text, Badge, Toast
} from 'native-base';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hook } from 'cavy';
import OverviewStatsApi from '../../api/overview/OverviewService';
import { updateFetchedUrl } from '../../store/actions/index';
import BottomZulTabs from '../../components/ui/navigation/BottomZulTabs';
// import getImageHandler from '../../components/utility/userImage/GetUserImage';
import { fontMaker, defaultModalFont, regularButtonFont } from '../../components/utility/fonts/FontMaker';
import { BASE_URL, headers } from '../../api/config/Config';
import {
  updateCurrentAssessment, setAssessmentType, updateQuestions, updateCurrentQuestion,
  updateAssessmentId, updateCurrentAnswerId,
} from '../../store/actions/assessment';
import themeCode from '../../components/utility/assessment/themeCodes';

const mapStateToProps = state => ({
  dimensionReport: state.Assessment.dimensionReport,
  userName: state.User.name,
  currentAssessment: state.Assessment.currentAssessment,
  assessmentsList: state.AssessmentList.assessmentsList,
  uDob: state.User.dob
});

const mapDispatchToProps = dispatch => ({
  updateFetchedUrlProp: url => dispatch(updateFetchedUrl(url)),
  SetAssessmentType: data => dispatch(setAssessmentType(data)),
  getAllQuestion: data => dispatch(updateQuestions(data)),
  getCurrentQuestion: data => dispatch(updateCurrentQuestion(data)),
  updatedAssessmentId: data => dispatch(updateAssessmentId(data)),
  updatedCurrentAnswerId: data => dispatch(updateCurrentAnswerId(data)),
  updatedCurrentAssessment: data => dispatch(updateCurrentAssessment(data))
});


class Overview extends Component {
  constructor(props) {
    super(props);
    const { userName } = this.props;
    this.didFocusSubscription = props.navigation.addListener('didFocus', () => { this.overViewService(userName); });
    this.logoutHandle = this.logoutHandle.bind(this);
    this.didFocusSubscription = props.navigation.addListener('didFocus', () => BackHandler.addEventListener('hardwareBackPress', this.logoutHandle));
  }

  state = {
    checkCount: 0,
    showSCLAlert: false,
    alertTitle: '',
    dimensionalAssessments: []
  }

  componentWillMount() {
    const { userName } = this.props;
    this.overViewService(userName);
    // getImageHandler(userName, updateFetchedUrlProp);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willBlurSubscription = navigation.addListener('willBlur', () => BackHandler.removeEventListener('hardwareBackPress', this.logoutHandle));
  }

  componentWillUnmount() {
    this.checkAndRemoveFocusSubscription();
    this.checkAndRemoveBlurSubscription();
    BackHandler.removeEventListener('hardwareBackPress', this.logoutHandle);
  }

  checkAndRemoveFocusSubscription = () => {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove();
    }
  };

  checkAndRemoveBlurSubscription = () => {
    if (this.willBlurSubscription) {
      this.willBlurSubscription.remove();
    }
  };

  overViewService = (userName) => {
    OverviewStatsApi.getOverviewStats(userName)
      .then(async (responseJson) => {
        await this.setState({
          checkCount: (responseJson.totalAssessmentCount - responseJson.givenAssessmentCount),
          dimensionalAssessments: responseJson.dimensionAssessment
        });
      });
  }

  toastMessage = () => {
    Toast.show({
      text: 'This feature will be Available Soon',
      duration: 2000,
      type: 'default'
    });
  }

  getDimensionAssementDetail = (data) => {
    const { dimensionalAssessments } = this.state;
    let id = null;
    let drafted = null;
    dimensionalAssessments.map((assessment) => {
      if (assessment.title === data) { id = assessment.id; drafted = assessment.drafted; }
    });
    if (id && drafted === 'drafted') {
      this.selectDraftedAssessment(data, id);
    } else if (id && drafted === 'completed') {
      this.selectReport(data, id);
    } else {
      this.selectAssessment(data);
    }
  }

  handleOpen = (title) => {
    this.setState({ showSCLAlert: true, alertTitle: title });
  }

  selectReport = (title, id) => {
    const { navigation, updatedAssessmentId, updatedCurrentAssessment } = this.props;
    updatedAssessmentId(id);
    updatedCurrentAssessment(title);
    navigation.navigate('AssessmentReport', { title });
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

  handleClose = () => { this.setState({ showSCLAlert: false }); }

  logoutAlert = () => (
    Alert.alert(
      'Zing Up Life',
      'Do you want to exit this application?',
      [
        { text: 'No', onPress: () => { } },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    )
  );

  logoutHandle = () => {
    this.logoutAlert();
    return true;
  }

  iconComponent = (iconName, iconSize, iconColor) => (
    <View style={styles.iconContainer}>
      <Icon name={iconName} size={iconSize} color={iconColor} />
    </View>
  );

  materialCommunityIconComponent = (iconName, iconSize, iconColor) => (
    <View style={styles.topIconContainer}>
      <MaterialCommunityIcon name={iconName} size={iconSize} color={iconColor} />
    </View>
  );

  iconComponentForModal = (iconName, iconSize, iconColor, colorArray) => (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={colorArray}
      style={{
        flex: 1, width: '100%', borderRadius: 40, justifyContent: 'center', alignItems: 'center'
      }}
    >
      {this.iconComponent(iconName, iconSize, iconColor)}
    </LinearGradient>
  );

  iconMaterialComponentForModal = (iconName, iconSize, iconColor, colorArray) => (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={colorArray}
      style={{
        flex: 1,
        width: '100%',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {this.materialCommunityIconComponent(iconName, iconSize, iconColor)}
    </LinearGradient>
  );

  getIconComponentForModal = (alertTitle) => {
    let iconComponent = null;
    const dimensionColorArray = ['#6FD3EE', '#A969EE'];
    switch (alertTitle.split(' ')[0]) {
      case 'Vitals':
        iconComponent = this.iconComponentForModal('heartbeat', 50, '#FFF', ['#6FD3EE', '#A969EE']);
        break;
      case 'Goals':
        iconComponent = this.iconComponentForModal('bullseye', 50, '#FFF', ['#E9214C', '#D78CE7']);
        break;
      case 'Experts':
        iconComponent = this.iconComponentForModal('address-book', 50, '#FFF', ['#F29B3C', '#F66FD8']);
        break;
      case 'Physical':
        iconComponent = this.iconMaterialComponentForModal('human', 50, '#FFF', dimensionColorArray);
        break;
      case 'Emotional':
        iconComponent = this.iconMaterialComponentForModal('emoticon-happy', 50, '#FFF', dimensionColorArray);
        break;
      case 'Environmental':
        iconComponent = this.iconMaterialComponentForModal('leaf', 50, '#FFF', dimensionColorArray);
        break;
      case 'Financial':
        iconComponent = this.iconMaterialComponentForModal('finance', 50, '#FFF', dimensionColorArray);
        break;
      case 'Intellectual':
        iconComponent = this.iconMaterialComponentForModal('school', 50, '#FFF', dimensionColorArray);
        break;
      case 'Occupational':
        iconComponent = this.iconMaterialComponentForModal('briefcase-check', 50, '#FFF', dimensionColorArray);
        break;
      case 'Social':
        iconComponent = this.iconMaterialComponentForModal('wechat', 50, '#FFF', dimensionColorArray);
        break;
      case 'Spiritual':
        iconComponent = this.iconMaterialComponentForModal('yin-yang', 50, '#FFF', dimensionColorArray);
        break;
      default:
        break;
    }
    return iconComponent;
  }

  getHeaderIconForModal = (title) => {
    let icon = null;
    switch (title.toLowerCase()) {
      case 'vitals': icon = this.iconComponentForModal('heartbeat', 50, '#FFF', ['#6FD3EE', '#A969EE']);
        break;
      case 'goals':
        icon = this.iconComponentForModal('bullseye', 50, '#FFF', ['#E9214C', '#D78CE7']);
        break;
      case 'experts':
        icon = this.iconComponentForModal('address-book', 50, '#FFF', ['#F29B3C', '#F66FD8']);
        break;
      default:
        break;
    }
    return icon;
  }

  didFocusSubscription;

  willBlurSubscription;

  render() {
    const { navigation, generateTestHook } = this.props;
    const { showSCLAlert, alertTitle, checkCount } = this.state;

    const vitals = this.iconComponent('heartbeat', 60, '#FFF');
    const goals = this.iconComponent('bullseye', 60, '#FFF');
    const experts = this.iconComponent('address-book', 60, '#FFF');

    const headerIcon = this.getIconComponentForModal(alertTitle);
    const right = true;
    return (
      <Container>
        <SCLAlert
          show={showSCLAlert}
          title={alertTitle}
          subtitle="This feature will be available soon."
          cancellable
          onRequestClose={this.handleClose}
          headerContainerStyles={{ backgroundColor: '#41ab3e' }}
          headerIconComponent={headerIcon}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton
            theme="success"
            onPress={this.handleClose}
            textStyle={{ ...regularButtonFont }}
          >
            OK
          </SCLAlertButton>
        </SCLAlert>
        <ScrollView scrollEnabled={false}>
          <ScrollView
            horizontal={right}
            directionalLockEnabled={right}
            contentContainerStyle={{ height: 200, width: 1200, backgroundColor: '#f7f7f7' }}
            style={{ flexDirection: 'row' }}
          >
            <TouchableOpacity style={styles.smallCard} onPress={() => this.getDimensionAssementDetail('Physical & Nutritional')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent('human', 60, '#FFF')}
              </LinearGradient>
              <Text style={styles.dimensionText}>Physical</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.getDimensionAssementDetail('Emotional')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent('emoticon-happy', 60, '#FFF')}
              </LinearGradient>
              <Text style={styles.dimensionText}>Emotional</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.getDimensionAssementDetail('Environmental')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent('leaf', 60, '#FFF')}
              </LinearGradient>
              <Text style={styles.dimensionText}>Environmental</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.getDimensionAssementDetail('Financial')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent('finance', 60, '#FFF')}
              </LinearGradient>
              <Text style={styles.dimensionText}>Financial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.getDimensionAssementDetail('Intellectual')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent('school', 60, '#FFF')}
              </LinearGradient>
              <Text style={styles.dimensionText}>Intellectual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.getDimensionAssementDetail('Occupational')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent('briefcase-check', 60, '#FFF')}
              </LinearGradient>
              <Text style={styles.dimensionText}>Occupational</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.getDimensionAssementDetail('Social')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent('wechat', 60, '#FFF')}
              </LinearGradient>
              <Text style={styles.dimensionText}>Social</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallCard} onPress={() => this.getDimensionAssementDetail('Spiritual')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.topIcon]}>
                {this.materialCommunityIconComponent('yin-yang', 60, '#FFF')}
              </LinearGradient>
              <Text style={styles.dimensionText}>Spiritual</Text>
            </TouchableOpacity>
          </ScrollView>
        </ScrollView>
        <ScrollView>
          <View style={styles.homeContainer}>
            <TouchableOpacity style={styles.card} ref={generateTestHook('Action.clickOnChecks')} onPress={() => navigation.navigate('AssessmentList')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#41D387', '#12BCEB']} style={[styles.left]}>
                <View style={styles.iconContainer}>
                  <Icon name="check-square-o" size={60} color="#fff" />
                </View>
                <Text style={{ color: '#fff', ...questionFontStyle }}>CHECKS</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <CardInfo type="pending" value={checkCount !== null && Number.isFinite(checkCount) ? checkCount : 0} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => this.handleOpen('Vitals')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#6FD3EE', '#A969EE']} style={[styles.left]}>
                {vitals}
                <Text style={{ color: '#FFF', ...questionFontStyle }}>VITALS</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <CardInfo type="active" value="0" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Goals')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#E9214C', '#D78CE7']} style={[styles.left]}>
                {goals}
                <Text style={{ color: '#FFF', ...questionFontStyle }}>GOALS</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <CardInfo type="created" value="0" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => this.handleOpen('Experts')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#F29B3C', '#F66FD8']} style={[styles.left]}>
                {experts}
                <Text style={{ color: '#FFF', ...questionFontStyle }}>EXPERTS</Text>
              </LinearGradient>
              <View style={styles.cardContent}>
                <CardInfo type="meetups" value="0" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View>
          <BottomZulTabs navigator={navigation} activeTab="home" />
        </View>
      </Container>
    );
  }
}

const questionFontStyle = fontMaker({ family: 'OpenSans', weight: 'Bold' });
const dimensionFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const badgeFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: '#f7f7f7',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    paddingHorizontal: 10,
    color: '#495057',
    fontSize: 13,
    fontWeight: 'bold'
  },
  smallCard: {
    height: 140,
    width: 140,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignItems: 'center',
    borderColor: 'transparent',
    paddingTop: 10,
  },
  topIcon: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '60%',
    borderRadius: 6
  },
  topIconContainer: {
    width: 90,
    height: 90,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dimensionText: {
    ...dimensionFontStyle,
    color: '#144e76',
    fontSize: 14
  },
  card: {
    height: 120,
    width: '90%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 30,
    elevation: 5,
    borderWidth: 0.15,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: 'transparent',
    shadowOffset: { width: 4, height: 4 },
    shadowColor: '#90a4ae',
    shadowOpacity: 5.0
  },
  left: {
    width: '40%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    height: '102%',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  iconContainer: {
    top: 5,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '60%',
    paddingLeft: 50
  }
});

const CardInfo = ({ value, type }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
    <Text style={{ fontSize: 40, color: '#37474f' }}>{value}</Text>
    <Badge style={{ backgroundColor: 'transparent' }} success>
      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['#963EBC', '#9B80B3']} style={{ borderRadius: 10, padding: 1 }}>
        <Text style={{ ...badgeFontStyle }}>{type}</Text>
      </LinearGradient>
    </Badge>
  </View>
);

export default connect(mapStateToProps, mapDispatchToProps)(hook(Overview));
