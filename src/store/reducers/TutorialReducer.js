const initialState = { isTutorialVisible: false };


const TutorialReducer = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case 'TutorialReducer_TutorialVisible': {
      newState = { ...state, isTutorialVisible: action.payload };
      break;
    }
    default:
      newState = { ...state };
      break;
  }
  return newState;
};

export default TutorialReducer;
