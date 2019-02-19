import { BASE_URL, headers } from '../config/Config';

export default class GetAssessmentReportService {
  static fetchAssessmentReport = reqId => fetch(`${BASE_URL}/api/getReport`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id: reqId, })
  }).then(response => response.json())
}
