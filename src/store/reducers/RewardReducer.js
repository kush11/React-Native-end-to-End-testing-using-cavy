const initialState = {
  totalReward: 0,
  isCongratulationVisible: false,
  isRewardModalVisible: false
};


const RewardReducer = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case 'RewardReducer_AddReward': {
      newState = { ...state, totalReward: state.totalReward + action.payload };
      break;
    }
    case 'RewardReducer_Congratulate': {
      newState = { ...state, isCongratulationVisible: action.payload };
      break;
    }

    case 'RewardReducer_RewardModalVisible': {
      newState = { ...state, isRewardModalVisible: action.payload };
      break;
    }
    default:
      newState = { ...state };
      break;
  }
  return newState;
};

export default RewardReducer;
