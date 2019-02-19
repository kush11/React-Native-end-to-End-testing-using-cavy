import 'isomorphic-fetch';
import GetAssessmentReportService from '../../../api/assessment/AssessmentReportService';
// Tests to check report functionality in assessment module
describe('Back End assesment report data', () => {
  const reqItem = '5bed4f606ae73140cc4b8aeb';
  const reqTheme = 'Relationship & Intimacy';
  let data;

  it('proper json response should come from backend', async () => {
    data = await GetAssessmentReportService.fetchAssessmentReport(reqItem);
    expect(data).toBeTruthy();
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toBeTruthy();
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toEqual(85.5);
  });
  it('theme name must be equal to Relationship & Intimacy', async () => {
    expect(data.answer[0].theme).toEqual(reqTheme);
  });
});
