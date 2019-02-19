import { UPDATE_TITLE, UPDATE_DURATION, UPDATE_HOURS_LEFT } from './actionTypes';

export const updateTitle = title => ({
  type: UPDATE_TITLE,
  payload: title
});
export const updateDuration = duration => ({
  type: UPDATE_DURATION,
  payload: duration
});

export const updateHoursLeft = hoursLeft => ({
  type: UPDATE_HOURS_LEFT,
  payload: hoursLeft
});
