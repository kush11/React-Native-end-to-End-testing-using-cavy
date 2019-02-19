import { BASE_URL, headers } from '../config/Config';

export default class GetAssessmentListService {
    static fetchAssessmentList = reqData => fetch(`${BASE_URL}/api/getAssessmentList`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reqData)
    }).then(response => response.json())
}
