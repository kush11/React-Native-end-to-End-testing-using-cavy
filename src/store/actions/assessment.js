import {
  UPDATE_ASSESSMENT_THEME,
  UPDATE_ASSESSMENT_ID,
  EXIT_ASSESSMENT,
  UPDATE_QUESTIONS,
  UPDATE_CURRENTQUESTION,
  IS_NEXT_QUESTION_LOADING,
  UPDATE_CURRENTASSESSMENT,
  UPDATE_ASSESSMENTDETAILS,
  UPDATE_CURRENT_FLOW,
  UPDATE_CURRENT_ANSWER
} from './actionTypes';


export const setAssessmentType = type => ({
  type: UPDATE_ASSESSMENT_THEME,
  payload: type
});
export const updateAssessmentId = id => ({
  type: UPDATE_ASSESSMENT_ID,
  payload: id
});
export const exitAssessment = clear => ({
  type: EXIT_ASSESSMENT,
  payload: clear
});

export const updateQuestions = questions => ({
  type: UPDATE_QUESTIONS,
  payload: questions
});

export const updateCurrentQuestion = question => ({
  type: UPDATE_CURRENTQUESTION,
  payload: question
});

export const isNextQuestionLoading = loading => ({
  type: IS_NEXT_QUESTION_LOADING,
  payload: loading
});

export const updateCurrentAssessment = currentAssessment => ({
  type: UPDATE_CURRENTASSESSMENT,
  payload: currentAssessment
});

export const updateAssessmentDetails = assessmentDetails => ({
  type: UPDATE_ASSESSMENTDETAILS,
  payload: assessmentDetails
});
export const updateCurrentFlow = flow => ({
  type: UPDATE_CURRENT_FLOW,
  payload: flow
});

export const updateCurrentAnswerId = flow => ({
  type: UPDATE_CURRENT_ANSWER,
  payload: flow
});
