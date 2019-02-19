import { UPDATE_TITLE, UPDATE_DURATION, UPDATE_HOURS_LEFT } from '../actions/actionTypes';

const initialState = {
  title: '',
  duration: '',
  hoursLeft: ''
};

const GoalsListReducer = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case UPDATE_TITLE: {
      newState = { ...state, title: action.payload };
      break;
    }
    case UPDATE_DURATION: {
      newState = { ...state, duration: action.payload };
      break;
    }
    case UPDATE_HOURS_LEFT: {
      newState = { ...state, hoursLeft: action.payload };
      break;
    }
    default:
      newState = { ...state };
      break;
  }
  return newState;
};

export default GoalsListReducer;
