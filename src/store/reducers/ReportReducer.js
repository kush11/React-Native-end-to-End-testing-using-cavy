import { UPDATE_ASSESSMENT_REPORT } from '../actions/actionTypes';

import dietIcon from '../../assets/images/goals/diet.jpg';
import sleepIcon from '../../assets/images/goals/sleep.jpg';
import sweatIcon from '../../assets/images/goals/sweat.jpg';
import immunityIcon from '../../assets/images/goals/immunity.jpg';
import posterIcon from '../../assets/images/goals/poster.jpg';

const initialState = {
  assessmentReport: {
    observations: [{
      text: 'Poor appetite',
      type: 'danger'
    }, {
      text: 'Poor posture',
      type: 'danger'
    }, {
      text: 'Poor diet',
      type: 'danger'
    }, {
      text: 'Lack of physical and mental growth',
      type: 'danger'
    }, {
      text: 'Poor sleep',
      type: 'danger'
    }, {
      text: 'Low BMI',
      type: 'danger'
    }, {
      text: 'Lower risk of inheriting diseases',
      type: 'success'
    }, {
      text: 'Good Physical Activity ',
      type: 'success'
    }],
    actionPlan: [
      {
        Goal: 'Balanced diet',
        icon: dietIcon,
        description: 'Include some protein, omega-3 fatty acid rich food, grain'
      },
      {
        Goal: 'Sleepathon',
        icon: sleepIcon,
        description: 'Self manage your stress level'
      }, {
        Goal: 'Sweat it out',
        icon: sweatIcon,
        description: 'Running,Intense workout,Games'
      },
      {
        Goal: 'Improve immunity',
        icon: immunityIcon,
        description: 'Snack on fruit,nuts or healthy snacks instead of packaged food'
      }, {
        Goal: 'Improve posture',
        icon: posterIcon,
        description: 'Yoga poses- bow pose, cobra pose, garuda pose'
      }
    ],
  }
};


const ReportReducer = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case UPDATE_ASSESSMENT_REPORT: {
      newState = { ...state, assessmentReport: action.payload };
      break;
    }
    default:
      newState = { ...state };
      break;
  }
  return newState;
};

export default ReportReducer;
