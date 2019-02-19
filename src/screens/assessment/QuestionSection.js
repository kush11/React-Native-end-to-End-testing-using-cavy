import React, { Component } from 'react';
import {
  Text, View, ImageBackground, StyleSheet, TouchableOpacity
} from 'react-native';
import { Badge } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';
import FadeInView from '../../assets/animations/FadeInView';
import SlideRightView from '../../assets/animations/SlideRightView';
import { fontMaker } from '../../components/utility/fonts/FontMaker';
import { updateCurrentQuestion, isNextQuestionLoading } from '../../store/actions/index';

const mapStateToProps = state => ({
  currentQuestion: state.Assessment.currentQuestion,
  isNextQuestionLoading: state.Assessment.isNextQuestionLoading,
  questions: state.Assessment.questions
});
const mapDispatchToProps = dispatch => ({
  goToQuestion: question => dispatch(updateCurrentQuestion(question)),
  loadingNextQuestion: isLoading => dispatch(isNextQuestionLoading(isLoading)),
});

// const renderPrevQuesIcon = () => {
//   const { currentQuestion } = this.props;
//   return (currentQuestion.no > 1)
//     ? <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-end', marginTop: 15, marginBottom: 15, backgroundColor: '#000000bb' }}>
//       <Icon name="ios-arrow-forward" size={50} color='white' style={{ paddingTop: 80, alignSelf: 'center' }} />
//     </TouchableOpacity> : null;
// };

// const renderNextQuesIcon = () => {
//   return <TouchableOpacity style={{ flex: 1, flexDirection: 'column', marginTop: 15, marginBottom: 15, backgroundColor: '#000000bb' }}>
//     <Icon name="ios-arrow-back" size={50} color='white' style={{ paddingTop: 80, alignSelf: 'center' }} />
//   </TouchableOpacity >
// };

class QuestionSection extends Component {
  state = { image: '' }

  componentDidMount = () => {
    const { currentQuestion } = this.props;

    if (currentQuestion.subtheme === 'Diet Score') { // Diet Score
      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Nutrition wheel.jpg' });
    }
    if (currentQuestion.subtheme === 'Exercise') {
      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Eating.jpg' });
    }

    if (currentQuestion.subtheme === 'Communication') { // Relationship & Intimacy
      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/R&I Item Screen.jpg' });
    }

    if (currentQuestion.subtheme === 'Appetite') { // Strength & Energy
      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/man-eating-pasta_1087-14.jpg' });
    }

    if (currentQuestion.subtheme === 'Breathing') { // Zest For Life

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Zest for life item screen.jpg' });
    }

    if (currentQuestion.subtheme === 'Anger Management') { // Thought Control
      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Thought control item screen.jpg' });
    }

    if (currentQuestion.subtheme === 'Strength and energy') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Wholesomeness item screen.png' });
    }

    if (currentQuestion.subtheme === 'Physical & Nutritional') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Physical Wellness.png' });
    }
    if (currentQuestion.subtheme === 'Emotional') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Emotional%20Wellness.png' });
    }
    if (currentQuestion.subtheme === 'Environmental') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Environmental Wellness.png' });
    }
    if (currentQuestion.subtheme === 'Financial') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Financial Wellness.png' });
    }
    if (currentQuestion.subtheme === 'Occupational') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Occupational Wellness.png' });
    }
    if (currentQuestion.subtheme === 'Social') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Social Wellness.png' });
    }

    if (currentQuestion.subtheme === 'Spiritual') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Spiritual Wellness.png' });
    }

    if (currentQuestion.subtheme === 'Intellectual') { // Wholesomeness

      this.setState({ image: 'https://zultestimageapi.herokuapp.com/image/Intellectual Wellness.png' });
    }
  }

  answerSelect = () => {
    const { selectAnswer, currentQuestion } = this.props;
    selectAnswer(currentQuestion.selectedIndex);
  };

  render() {
    const {
      currentQuestion, isNextQuestionLoading, goToQuestion, questions, buttonDisable
    } = this.props;
    const { image } = this.state;
    return (
      <ImageBackground source={{ uri: image }} resizeMode="cover" style={styles.backImage}>
        <Progress.Bar style={{ borderRadius: 0, borderWidth: 0, marginLeft: -1, padding: 0 }} progress={currentQuestion.no / parseFloat(questions.length)} width={null} color={currentQuestion.progressBarColor || '#ff2626'} unfilledColor='#ffffff' />
        {!isNextQuestionLoading && <SlideRightView>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {(currentQuestion.no > 1)
              ? <TouchableOpacity
                onPress={() => { goToQuestion(questions[currentQuestion.no - 2]); }}
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  marginTop: 15,
                  marginBottom: 15,
                  backgroundColor: '#000000bb'
                }}
              >
                <Icon name="ios-arrow-back" size={50} color="white" style={{ paddingTop: 80, alignSelf: 'center' }} />

              </TouchableOpacity >
              : null
            }
            <View style={styles.questionView}>

              <View style={{ padding: 5 }}>
                <Badge style={{ backgroundColor: '#ffffff91' }}>
                  <Text style={{ fontWeight: 'bold', color: '#000000', marginTop: 3 }}>
                    {currentQuestion.no}
                    /
                    {questions.length}
                  </Text>
                </Badge>
              </View>

              <View style={styles.questionContainer}>
                <FadeInView duration={500} delay={200}>
                  <Text style={styles.questionStatement}>{currentQuestion.statement}</Text>
                </FadeInView>
              </View>
            </View>
            {(currentQuestion.no < questions.length || currentQuestion.ansType === 'multiple')
              ? <TouchableOpacity
                disabled={buttonDisable}
                onPress={this.answerSelect}
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  marginTop: 15,
                  marginBottom: 15,
                  backgroundColor: '#000000bb'
                }}
              >
                <Icon name="ios-arrow-forward" size={50} color={buttonDisable ? 'grey' : 'white'} style={{ paddingTop: 80, alignSelf: 'center' }} />
              </TouchableOpacity>
              : null
            }
          </View>
        </SlideRightView>}
      </ImageBackground>

    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(QuestionSection);

const questionFontStyle = fontMaker({ family: 'OpenSans', weight: 'Regular' });
const styles = StyleSheet.create({
  backImage: {
    flex: 1,
    elevation: 5,
    borderWidth: 0.15,
    borderColor: 'transparent'
  },
  questionView: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#00000066',
    flex: 10,
    flexDirection: 'column'
  },

  questionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 5
  },
  questionStatement: {
    ...questionFontStyle,
    color: '#ffffff',
    fontSize: 20
  }
});
