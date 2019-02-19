import 'isomorphic-fetch';
import OverviewService from '../../api/overview/OverviewService';
// Tests to check report functionality in assessment module
describe('Wellness Overview test suit', () => {
  const username = 'viv';
  let data;

  it('proper json response should come from backend', async () => {
    data = await OverviewService.getOverviewStats(username);
    expect(data).toBeTruthy();
  });
  it('proper Given assessment count should come from backend', async () => {
    expect(data.givenAssessmentCount).toBeTruthy();
  });
  it('correct given assessment count should come from backend', async () => {
    expect(data.givenAssessmentCount).toEqual(6);
  });
  it('proper Total assessment count should come from backend', async () => {
    expect(data.totalAssessmentCount).toBeTruthy();
  });
  it('correct total assessment count should come from backend', async () => {
    expect(data.totalAssessmentCount).toEqual(6);
  });
});
