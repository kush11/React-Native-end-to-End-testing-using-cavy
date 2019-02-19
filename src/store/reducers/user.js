import {
  UPDATE_USERNAME, UPDATE_MOBILE, UPDATE_EMAIL, UPDATE_OTP, UPDATE_PASSCODE,
  UPDATE_GENDER, UPDATE_DOB, UPDATE_GOOGLE_USER_IMAGE, UPDATE_FETCHED_URL,
  UPDATE_HEIGHT, UPDATE_WEIGHT, UPDATE_TEMPHEIGHT, UPDATE_TEMPWEIGHT, UPDATE_BMI,
  UPDATE_INVITECODE, RESET_STATE, UPDATE_TEMPDOB, UPDATE_GOOGLETOKEN, UPDATE_IMAGE_DETAILS
}
  from '../actions/actionTypes';

const initialState = {
  name: '',
  mobile: '',
  email: '',
  otp: '',
  passcode: '',
  gender: '',
  dob: '',
  socialImage: '',
  googleToken: '',
  fetchedURL: '',
  height: 0,
  weight: 0,
  bmi: '',
  tempheight: 0,
  tempweight: 0,
  tempDob: '',
  inviteCode: '',
  imageDetails: {
    secure_url: '',
    public_id: '',
    created_at: ''
  }
};


const UserReducer = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case RESET_STATE: {
      newState = {
        ...state,
        name: '',
        mobile: '',
        email: '',
        otp: '',
        passcode: '',
        gender: '',
        dob: '',
        socialImage: '',
        googleToken: '',
        fetchedURL: '',
        height: 0,
        weight: 0,
        bmi: '',
        tempheight: 0,
        tempweight: 0,
        tempDob: '',
        inviteCode: '',
        imageDetails: {
          secure_url: '',
          public_id: '',
          created_at: ''
        }
      };
      break;
    }
    case UPDATE_IMAGE_DETAILS: {
      // console.log("image", action.payload)
      newState = {
        ...state,
        imageDetails: {
          ...state.imageDetails,
          secure_url: action.payload.secure_url,
          public_id: action.payload.public_id,
          created_at: action.payload.created_at
        }
      };
      break;
    }
    case UPDATE_TEMPDOB: {
      newState = { ...state, tempDob: action.payload };
      break;
    }
    case UPDATE_USERNAME: {
      newState = { ...state, name: action.payload };
      break;
    }
    case UPDATE_MOBILE: {
      newState = { ...state, mobile: action.payload };
      break;
    }
    case UPDATE_EMAIL: {
      newState = { ...state, email: action.payload };
      break;
    }
    case UPDATE_OTP: {
      newState = { ...state, otp: action.payload };
      break;
    }
    case UPDATE_PASSCODE: {
      newState = { ...state, passcode: action.payload };
      break;
    }
    case UPDATE_GOOGLE_USER_IMAGE: {
      newState = {
        ...state,
        socialImage: action.payload
      };
      break;
    }
    case UPDATE_GOOGLETOKEN: {
      newState = {
        ...state,
        googleToken: action.payload
      };
      break;
    }
    case UPDATE_FETCHED_URL: {
      newState = {
        ...state,
        fetchedURL: action.payload
      };
      break;
    }
    case UPDATE_DOB: {
      newState = {
        ...state,
        dob: action.payload
      };
      break;
    }
    case UPDATE_GENDER: {
      newState = {
        ...state,
        gender: action.payload
      };
      break;
    }
    case UPDATE_INVITECODE: {
      newState = {
        ...state,
        inviteCode: action.payload
      };
      break;
    }
    case UPDATE_HEIGHT: {
      newState = {
        ...state,
        height: action.payload
      };
      break;
    }
    case UPDATE_WEIGHT: {
      newState = {
        ...state,
        weight: action.payload
      };
      break;
    }
    case UPDATE_TEMPHEIGHT: {
      newState = {
        ...state,
        tempheight: action.payload
      };
      break;
    }
    case UPDATE_TEMPWEIGHT: {
      newState = {
        ...state,
        tempweight: action.payload
      };
      break;
    }
    case UPDATE_BMI: {
      newState = {
        ...state,
        bmi: action.payload
      };
      break;
    }
    default:
      newState = { ...state };
      break;
  }
  return newState;
};

export default UserReducer;
