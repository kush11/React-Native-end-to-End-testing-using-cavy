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
} from '../actions/actionTypes';

import physicalIcon from '../../assets/images/dashboard/physical.png';
import physicalEmoji from '../../assets/images/emoji/01.png';

import emotionalIcon from '../../assets/images/dashboard/emotional.png';
import emotionalEmoji from '../../assets/images/emoji/02.png';

import spiritualIcon from '../../assets/images/dashboard/spiritual.png';
import spiritualEmoji from '../../assets/images/emoji/03.png';

import environmentalIcon from '../../assets/images/dashboard/environmental.png';
import environmentalEmoji from '../../assets/images/emoji/04.png';

import financialIcon from '../../assets/images/dashboard/financial.png';

import socialIcon from '../../assets/images/dashboard/social.png';

import intellectualIcon from '../../assets/images/dashboard/intellectual.png';

import occupationalIcon from '../../assets/images/dashboard/occupational.png';

/* DATA VARIABLES FOR ASSESSMENT REDUCER */
const initialState = {
  currentQuestion: {},
  questions: [],
  currentAssessment: '',
  assessmentId: null,
  currentAssessmentDetails: [],
  isNextQuestionLoading: false,
  currentFlow: 'NEW',
  currentAnswerId: null,
  dimensionReport: [{
    title: 'Physical',
    score: '95%',
    icon: physicalIcon,
    emoji: physicalEmoji,
    progressColor: '#00b386'
  }, {
    title: 'Emotional',
    score: '75%',
    icon: emotionalIcon,
    emoji: emotionalEmoji,
    progressColor: '#00b386'
  }, {
    title: 'Spiritual',
    score: '45%',
    icon: spiritualIcon,
    emoji: spiritualEmoji,
    progressColor: 'rgb(254, 136, 55)'
  }, {
    title: 'Environmental',
    score: '25%',
    icon: environmentalIcon,
    emoji: environmentalEmoji,
    progressColor: '#dc3545'
  }, {
    title: 'Financial',
    score: '21%',
    icon: financialIcon,
    emoji: environmentalEmoji,
    progressColor: '#dc3545'
  }, {
    title: 'Social',
    score: '54%',
    icon: socialIcon,
    emoji: spiritualEmoji,
    progressColor: 'rgb(254, 136, 55)'
  }, {
    title: 'Intellectual',
    score: '92%',
    icon: intellectualIcon,
    emoji: physicalEmoji,
    progressColor: '#00b386'
  }, {
    title: 'Occupational',
    score: '89%',
    icon: occupationalIcon,
    emoji: physicalEmoji,
    progressColor: '#00b386'
  }],
  assessmentReport: [{
    title: 'Strength & Energy',
    remainingTime: '2 days ago',
    compPercentage: '25%',
  }, {
    title: 'Biological Age',
    remainingTime: '5 days ago',
    compPercentage: '35%'
  }, {
    title: 'Diet Score',
    remainingTime: '65 days ago',
    compPercentage: '65%'
  }, {
    title: 'Relationship & Intimacy',
    remainingTime: '83 days ago',
    compPercentage: '85%'
  }, {
    title: 'Thought Control',
    remainingTime: '73 days ago',
    compPercentage: '21%'
  }, {
    title: 'Wholesomeness',
    remainingTime: '32 days ago',
    compPercentage: '30%'
  }, {
    title: 'Zest For Life',
    remainingTime: '25 days ago',
    compPercentage: '91%'
  }
  ]
};


const AssessmentReducer = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case UPDATE_ASSESSMENT_THEME: {
      newState = { ...state, currentAssessment: action.payload };
      break;
    }
    case UPDATE_ASSESSMENT_ID: {
      newState = { ...state, assessmentId: action.payload };
      break;
    }
    case EXIT_ASSESSMENT: {
      newState = action.payload;
      break;
    }
    case UPDATE_CURRENT_ANSWER: {
      newState = { ...state, currentAnswerId: action.payload };
      break;
    }
    case UPDATE_QUESTIONS: {
      newState = { ...state, questions: action.payload };
      break;
    }
    case UPDATE_CURRENTQUESTION: {
      newState = { ...state, currentQuestion: action.payload };
      break;
    }
    case IS_NEXT_QUESTION_LOADING: {
      newState = { ...state, isNextQuestionLoading: action.payload };
      break;
    }
    case UPDATE_CURRENTASSESSMENT: {
      newState = { ...state, currentAssessment: action.payload };
      break;
    }
    case UPDATE_ASSESSMENTDETAILS: {
      newState = { ...state, currentAssessmentDetails: action.payload };
      break;
    }
    case UPDATE_CURRENT_FLOW: {
      newState = { ...state, currentFlow: action.payload };
      break;
    }
    default:
      newState = { ...state };
      break;
  }
  return newState;
};

export default AssessmentReducer;
