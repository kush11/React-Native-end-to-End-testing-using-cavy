import { UPDATE_ASSESSMENT_REPORT } from './actionTypes';

const updateAssessmentReport = data => ({
  type: UPDATE_ASSESSMENT_REPORT,
  payload: data
});
export default updateAssessmentReport;
