import 'isomorphic-fetch';
import GetAssessmentReportService from '../../../api/assessment/AssessmentReportService';
// Tests to check report functionality in assessment module
describe('Thought Control  assesment report data', () => {
  const reqItem = '5bf282f5869afa55ddf9a12b';

  const reqTheme = 'Thought Control';
  let data;

  it('proper json response should come from backend', async () => {
    data = await GetAssessmentReportService.fetchAssessmentReport(reqItem);
    expect(data).toBeTruthy();
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toBeTruthy();
  });

  it('proper Final Score should come from backend', async () => {
    expect(data.finalScore).toEqual(62);
  });
  it('proper Final Score should come from backend', async () => {
    expect(data.answer[0].theme).toEqual(reqTheme);
  });
});
