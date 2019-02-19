import React, { Component } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';
import { Toast } from 'native-base';
import { connect } from 'react-redux';
import { getLabel } from '../../components/utility/locale/I18N';

import ReportQuestionService from '../../api/assessment/ReportQuestionService';

const mapStateToProps = state => ({
  currentQuestion: state.Assessment.currentQuestion,
  isNextQuestionLoading: state.Assessment.isNextQuestionLoading,
  questions: state.Assessment.questions,
  User: state.User.name
});

class ReportAssessmentDialog extends Component {
  state = {
    // dialogVisible: this.props.visible,
    feedback: '',
  };

  showDialog = () => {
    const { showReportQuestionDialog } = this.props;
    showReportQuestionDialog();
  };

  handleCancel = () => {
    const { hideReportQuestionDialog } = this.props;
    hideReportQuestionDialog();
    this.setState({ feedback: '' });
  };

  handleSend = () => {
    const { currentQuestion, user = 'guest', hideReportQuestionDialog } = this.props;
    const { feedback } = this.state;
    // send logic
    const requestObject = {
      questionId: currentQuestion._id,
      feedback,
      user
    };
    let isFeedbackEmpty = false;
    try {
      if (feedback === '') {
        Toast.show({
          text: 'Please provide some details on feedback',
          duration: 2000,
          type: 'default'
        });
        isFeedbackEmpty = true;
        return;
      }

      ReportQuestionService.fetchFeedback(requestObject)
        .then((responseJson) => {
          if (responseJson !== null && responseJson !== 'undefined') {
            if (responseJson._id) {
              Toast.show({
                text: 'Feedback submitted successfully',
                duration: 2000,
                type: 'default'
              });
            } else {
              Alert.alert('Something Went Wrong!', 'Response is null/undefined or _id is not present');
            }
          } else {
            Alert.alert('Something Went Wrong!', 'Response is null/undefined');
          }
        })
        .catch((error) => {
          Toast.show({
            text: error,
            duration: 2000,
            type: 'default'
          });
        });
    } finally {
      if (!isFeedbackEmpty) { hideReportQuestionDialog(); }

      this.setState({ feedback: '' });
    }
  };

  render() {
    const { visible } = this.props;
    const { feedback } = this.state;
    return (
      <Dialog.Container visible={visible}>
        <Dialog.Title style={styles.titleStyle}>
          {getLabel('assessment.feedbackTitle')}
        </Dialog.Title>
        <Dialog.Description style={styles.descStyle}>
          {getLabel('assessment.feedbackDescription')}
        </Dialog.Description>

        <Dialog.Input
          multiline
          style={{ paddingHorizontal: 20 }}
          maxLength={100}
          placeholder="Write here"
          onChangeText={text => this.setState({ feedback: text })}
          value={feedback}
        >
        </Dialog.Input>
        <Dialog.Button label={getLabel('assessment.feedbackCancelButton')} onPress={this.handleCancel} />
        <Dialog.Button label={getLabel('assessment.feedbackSendButton')} onPress={this.handleSend} />
      </Dialog.Container>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    color: 'black',
    alignSelf: 'center'
  },
  descStyle: { color: 'black' }
});

export default connect(mapStateToProps)(ReportAssessmentDialog);
