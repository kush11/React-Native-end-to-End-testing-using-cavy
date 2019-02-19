import 'isomorphic-fetch';
import GetAssessmentReportService from '../../../api/assessment/AssessmentReportService';
// Tests to check report functionality in assessment module
describe('Back End assesment report data', () => {
  const reqItem = '5bed13616ae73140cc4b8a30';

  const reqTheme = 'Zest For Life';
  let data;

  it('proper json response should come from backend', async () => {
    data = await GetAssessmentReportService.fetchAssessmentReport(reqItem);
    expect(data).toBeTruthy();
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toBeTruthy();
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toEqual(53.75);
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.answer[0].theme).toEqual(reqTheme);
  });
});
