import 'isomorphic-fetch';
import GetAssessmentReportService from '../../../api/assessment/AssessmentReportService';
// Tests to check report functionality in assessment module
describe('Thought Control  assesment report data', () => {
  const reqItem = '5c52c0cc808ea30004c215c5';

  const reqTheme = 'Wholesomeness';
  let data;

  it('proper json response should come from backend', async () => {
    data = await GetAssessmentReportService.fetchAssessmentReport(reqItem);
    expect(data).toBeTruthy();
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toBeTruthy();
  });

  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toEqual("71.88");
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.answer[0].theme).toEqual(reqTheme);
  });
});
