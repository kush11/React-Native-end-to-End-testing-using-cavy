import { UPDATE_ASSESSMENTSLIST } from '../actions/actionTypes';

/* DATA VARIABLES FOR ASSESSMENT LIST REDUCER */
const initialState = { assessmentsList: [] };

const AssessmentListReducer = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case UPDATE_ASSESSMENTSLIST: {
      newState = { ...state, assessmentsList: action.payload };
      break;
    }
    default:
      newState = { ...state };
      break;
  }
  return newState;
};

export default AssessmentListReducer;
