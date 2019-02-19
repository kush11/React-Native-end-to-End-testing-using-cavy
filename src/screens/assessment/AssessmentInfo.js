
import React, { Component } from 'react';
import {
  View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, BackHandler
} from 'react-native';
import {
  Text, Container, Content, Toast
} from 'native-base';
import { connect } from 'react-redux';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { setAssessmentType, updateQuestions, updateCurrentQuestion } from '../../store/actions/index';
import GetAssessmentInfoService from '../../api/assessment/AssessmentInfoService';
import { fontMaker, regularButtonFont, defaultModalFont } from '../../components/utility/fonts/FontMaker';

/* REQUIRED CONSTANTS */

const mapStateToProps = state => ({
  currentAssessment: state.Assessment.currentAssessment,
  uName: state.User.name,
  uHeight: state.User.height,
  uWeight: state.User.weight,
  uDob: state.User.dob

});
const mapDispatchToProps = dispatch => ({
  getAllQuestion: data => dispatch(updateQuestions(data)),
  getCurrentQuestion: data => dispatch(updateCurrentQuestion(data)),
  SetAssessmentType: type => dispatch(setAssessmentType(type))
});

class AssessmentInfo extends Component {
  constructor(props) {
    super(props);
    this.logoutHandle = this._logoutHandle.bind(this);
    this._didFocusSubscription = props.navigation.addListener('didFocus', () => BackHandler.addEventListener('hardwareBackPress', this.logoutHandle));
    this.state = {
      updatedList: [],
      BmiScreen: false,
      showSCLAlert: false,
      alertTitle: '',
    };
  }

  componentWillMount() {
    const { currentAssessment } = this.props;
    this.filterobject(currentAssessment);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this._willBlurSubscription = navigation.addListener(
      'willBlur',
      () => BackHandler.removeEventListener('hardwareBackPress', this.logoutHandle)
    );
  }

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.logoutHandle);
  }

  logoutAlert = () => {
    const { navigation, uName } = this.props;
    uName === ''
      ? navigation.navigate('StartPage')
      : navigation.navigate('AssessmentList');
  };

  _logoutHandle = () => {
    this.logoutAlert();
    return true;
  }

  checkAssessment = () => {
    const {
      navigation, uName, uDob, uWeight, uHeight
    } = this.props;
    const { updatedList } = this.state;
    if (updatedList.themeName === 'Biological Age') {
      if (uName === '' || !uDob || uDob === '') {
        navigation.navigate('Bmi');
      } else if (uHeight === 0 || uWeight === 0 || uDob === '') {
        navigation.navigate('Bmi');
      } else {
        this.goAssessment();
      }
    } else if (uName === '' || !uDob || uDob === '') {
      navigation.navigate('Bmi');
    } else {
      this.goAssessment();
    }
  }

  toggleModal = () => {
    this.setState(prevState => ({ BmiScreen: !prevState.BmiScreen }));
  }

  modalRedirect = () => {
    const { navigation, currentAssessment } = this.props;
    this.toggleModal();
    navigation.navigate('Assessment', { title: currentAssessment });
  }

  goAssessment = () => {
    const { navigation, currentAssessment } = this.props;
    navigation.navigate('Assessment', { title: currentAssessment });
  }

  handleOpen = () => {
    this.setState({ showSCLAlert: true });
  }

  handleClose = () => {
    this.setState({ showSCLAlert: false });
  }

  filterobject = (reqItem) => {
    GetAssessmentInfoService.fetchAssessmentInfo(reqItem)
      .then((responseJson) => {
        responseJson[0].imageURL = { uri: responseJson[0].imageURL };
        for (const item of responseJson) {
          this.setState({ updatedList: item });
        }
      })
      .catch((error) => {
        // maintaining sanity
        Toast.show({
          text: error,
          duration: 2000,
          type: 'default'
        });
        this.setState({ alertTitle: 'Check network' });
        this.handleOpen();
      });
  }

  render() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const { showSCLAlert, alertTitle, updatedList } = this.state;
    return (
      <Container>
        <SCLAlert
          theme="danger"
          show={showSCLAlert}
          title="Oops!"
          subtitle={alertTitle}
          cancellable
          onRequestClose={this.handleClose}
          headerContainerStyles={{ backgroundColor: '#41ab3e' }}
          titleStyle={{ ...defaultModalFont }}
          subtitleStyle={{ ...defaultModalFont }}
        >
          <SCLAlertButton theme="danger" onPress={this.handleClose} textStyle={{ ...regularButtonFont }}>CLOSE</SCLAlertButton>
        </SCLAlert>

        <Content>
          <ImageBackground source={updatedList.imageURL} style={styles.imageURL} resizeMode="cover">
            <View style={styles.questionView}>
              <Text style={styles.title}>{updatedList.themeName}</Text>
            </View>
          </ImageBackground>
          <View style={{
            flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingBottom: 5, paddingTop: 50
          }}
          >
            <Text style={styles.textStyle}>
              {`“${quote.quote}”`}
            </Text>
          </View>
          <View style={{
            flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10, paddingTop: 5
          }}
          >
            <Text style={styles.authorTextStyle}>
              {`-${quote.author}`}
            </Text>
          </View>
        </Content>

        <TouchableOpacity style={styles.letsStartBtn} onPress={this.checkAssessment}>
          <Text style={styles.whiteText}>{"Let's start".toUpperCase()}</Text>
        </TouchableOpacity>
      </Container>
    );
  }
}

const windowObj = Dimensions.get('window');
const screenwidth = windowObj.width + 10;
const screenheight = windowObj.height / 3;

// styles
const quoteFontStyle = fontMaker({ family: 'Montserrat', weight: 'Regular' });
const authorFontStyle = fontMaker({ family: 'OpenSans', weight: 'SemiBold', style: 'Italic' });
const titleFontStyle = fontMaker({ family: 'Montserrat', weight: 'Bold' });
const styles = StyleSheet.create({
  letsStartBtn: {
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
  letsStart: {
    color: '#fff',
    fontSize: 18

  },
  questionView: {
    margin: 30,
    backgroundColor: '#00000066',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...titleFontStyle,
    fontSize: 30,
    padding: 5,
    color: 'white',
    alignSelf: 'center'
  },
  imageURL: {
    right: 5,
    width: screenwidth,
    height: screenheight
  },
  buttonStyle: {
    padding: 5,
    height: 30
  },
  textStyle: {
    ...quoteFontStyle,
    fontSize: 25,
    padding: 10
  },
  authorTextStyle: {
    ...authorFontStyle,
    fontSize: 30,
    padding: 10
  },
});

const quotes = [
  {
    quote: 'The greatest wealth is health.',
    author: 'Virgil'
  },
  {
    quote: 'Cheerfulness is the best promoter of health and is as friendly to the mind as to the body.',
    author: 'Joseph Addison'
  },
  {
    quote: 'A healthy outside starts from the inside.',
    author: 'Robert Urich'
  },
  {
    quote: 'To keep the body in good health is a duty otherwise we shall not be able to keep our mind strong and clear.',
    author: 'Buddha'
  },
  {
    quote: 'Your body hears everything your mind says.',
    author: 'Naomi Judd'
  },
  {
    quote: 'The part can never be well unless the whole is well.',
    author: 'Plato'
  },
  {
    quote: 'Health and cheerfulness naturally beget each other.',
    author: 'Joseph Addison'
  },
  {
    quote: 'There is no one giant step that does it. It’s a lot of little steps.',
    author: 'Unknown'
  },
  {
    quote: 'I have chosen to be happy because it is good for my health.',
    author: 'Voltaire'
  },
  {
    quote: 'Health is a state of body. Wellness is a state of being.',
    author: 'J. Stanford'
  },
  {
    quote: 'Your body will be around a lot longer than that expensive handbag. Invest in yourself.',
    author: 'Unknown'
  },
  {
    quote: 'Health is the thing that makes you feel that now is the best time of year.',
    author: 'Franklin P. Adams'
  },
  {
    quote: 'Embrace and love your body. It’s the most amazing thing you will ever own.',
    author: 'Unknown'
  },
  {
    quote: 'He who has health has hope; and he who has hope has everything.',
    author: 'Arabian Proverb'
  }
];

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentInfo);
