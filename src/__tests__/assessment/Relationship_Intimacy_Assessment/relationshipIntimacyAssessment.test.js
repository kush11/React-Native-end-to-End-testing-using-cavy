import 'isomorphic-fetch';
import GetAssessmentInfoService from '../../../api/assessment/AssessmentInfoService';
// Tests to check report functionality in assessment module
describe('Back End assesment list data', () => {
  // request object

  const reqItem = 'Relationship & Intimacy';
  const themeCode = 'RAI';
  const description = 'An intimate relationship is an interpersonal relationship that involves physical or emotional intimacy. Physical intimacy is characterized by friendship, platonic love, romantic love, or sexual activity. While the term intimate relationship commonly implies the inclusion of a sexual relationship, the term is also used as a euphemism for a relationship that is strictly sexual.';
  const reqImageURL = 'https://zulimageapi.herokuapp.com/image/A10023-min.jpg';
  let data;

  it('proper json response should come from backend', async () => {
    data = await GetAssessmentInfoService.fetchAssessmentInfo(reqItem);
    expect(data).toBeTruthy();
  });
  it('proper json response should come from backend', async () => {
    expect(data[0].themeName).toEqual(reqItem);
  });
  it('check for the themeCode', async () => {
    expect(data[0].themeCode).toEqual(themeCode);
  });
  it('check for the decription', async () => {
    expect(data[0].description).toEqual(description);
  });
  it('proper imageURL should come from backend', async () => {
    expect(data[0].imageURL).toEqual(reqImageURL);
  });
});
