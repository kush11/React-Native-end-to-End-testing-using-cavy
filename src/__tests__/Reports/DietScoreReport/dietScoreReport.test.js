import 'isomorphic-fetch';
import GetAssessmentReportService from '../../../api/assessment/AssessmentReportService';
// Tests to check report functionality in assessment module
describe('Back End assesment report data', () => {
  const reqItem = '5bebb34156778e3a80c42b67';
  let data;

  it('proper json response should come from backend', async () => {
    data = await GetAssessmentReportService.fetchAssessmentReport(reqItem);
    expect(data).toBeTruthy();
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toBeTruthy();
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toEqual(25);
  });
});
