import 'isomorphic-fetch';
import GetAssessmentInfoService from '../../../api/assessment/AssessmentInfoService';
// Tests to check Though control assessment  functionality in assessment module
describe('Zest For Life list data', () => {
  // request object

  const reqItem = 'Zest For Life';
  const reqCode = 'ZFL';
  const reqDescription = "Zest is a kind of zeal or enthusiasm. If you've got a zest for something, you put your whole heart and soul into it. Dancers who have great zest leap, kick, and soar their way around the stage with a kind of joyful energy.";
  const reqImageURL = 'https://zulimageapi.herokuapp.com/image/A10026-min.jpg';
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
