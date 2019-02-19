import 'isomorphic-fetch';
import GetAssessmentInfoService from '../../../api/assessment/AssessmentInfoService';
// Tests to check Though control assessment  functionality in assessment module
describe('Wholesomeness list data', () => {
  // request object

  const reqItem = 'Wholesomeness';
  const reqCode = 'WSMN';
  const reqDescription = "Wholesomeness is promoting health or well-being of mind or spirit. If you describe something as wholesome, you approve of it because you think it is likely to have a positive influence on people's behaviour or mental state, especially because it does not involve anything sexually immoral.";
  const reqImageURL = 'https://zulimageapi.herokuapp.com/image/A10033-min.jpg';
  let data;

  it('proper json response should come from backend', async () => {
    data = await GetAssessmentInfoService.fetchAssessmentInfo(reqItem);
    expect(data).toBeTruthy();
  });
  it('proper theme Name should come from backend', async () => {
    expect(data[0].themeName).toEqual(reqItem);
  });
  it('proper theme Code should come from backend', async () => {
    expect(data[0].themeCode).toEqual(reqCode);
  });
  it('proper description should come from backend', async () => {
    expect(data[0].description).toEqual(reqDescription);
  });
  it('proper imageURL should come from backend', async () => {
    console.log(data[0].imageURL);
    expect(data[0].imageURL).toEqual(reqImageURL);
  });
});
