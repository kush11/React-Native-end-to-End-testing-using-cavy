import {
  UPDATE_USERNAME, UPDATE_MOBILE, UPDATE_EMAIL,
  UPDATE_OTP, UPDATE_PASSCODE, UPDATE_GENDER,
  UPDATE_DOB, UPDATE_GOOGLE_USER_IMAGE,
  UPDATE_FETCHED_URL, UPDATE_HEIGHT, UPDATE_WEIGHT,
  UPDATE_BMI, UPDATE_TEMPHEIGHT, UPDATE_TEMPWEIGHT,
  UPDATE_INVITECODE, RESET_STATE, UPDATE_TEMPDOB, UPDATE_GOOGLETOKEN,
  UPDATE_IMAGE_DETAILS
} from './actionTypes';

export const updateUserImageDetails = (imageDetails) => {
  // console.log("imageaaaya", imageDetails);
  return {
    type: UPDATE_IMAGE_DETAILS,
    payload: imageDetails
  };
};

export const updateBmi = bmi => ({
  type: UPDATE_BMI,
  payload: bmi
});
export const updateTempDob = tempDob => ({
  type: UPDATE_TEMPDOB,
  payload: tempDob
});
export const resetState = () => ({ type: RESET_STATE });
export const updateHeight = height => ({
  type: UPDATE_HEIGHT,
  payload: height
});
export const updateWeight = weight => ({
  type: UPDATE_WEIGHT,
  payload: weight
});
export const updateTempHeight = tempheight => ({
  type: UPDATE_TEMPHEIGHT,
  payload: tempheight
});
export const updateTempWeight = tempweight => ({
  type: UPDATE_TEMPWEIGHT,
  payload: tempweight
});

export const updateGender = gender => ({
  type: UPDATE_GENDER,
  payload: gender
});

export const updateInviteCode = inviteCode => ({
  type: UPDATE_INVITECODE,
  payload: inviteCode
});

export const updateDob = dob => ({
  type: UPDATE_DOB,
  payload: dob
});

export const updateUsername = name => ({
  type: UPDATE_USERNAME,
  payload: name
});

export const updateUserSocialImage = image => ({
  type: UPDATE_GOOGLE_USER_IMAGE,
  payload: image
});

export const updateGoogleToken = googleToken => ({
  type: UPDATE_GOOGLETOKEN,
  payload: googleToken
});

export const updateFetchedUrl = url => ({
  type: UPDATE_FETCHED_URL,
  payload: url
});

export const updateMobile = mobile => ({
  type: UPDATE_MOBILE,
  payload: mobile
});

export const updateEmail = email => ({
  type: UPDATE_EMAIL,
  payload: email
});

export const updateOtp = otp => ({
  type: UPDATE_OTP,
  payload: otp
});

export const updatePasscode = passcode => ({
  type: UPDATE_PASSCODE,
  payload: passcode
});
