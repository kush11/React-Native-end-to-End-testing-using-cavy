import { BASE_URL, headers } from '../config/Config';

export default class ReportQuestionService {
    static fetchFeedback = requestObject => fetch(`${BASE_URL}/api/savefeedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestObject)
    }).then(response => response.json())
}
