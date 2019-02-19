import 'isomorphic-fetch';
import GetImageDataService from '../../api/userImage/UserImageGetService';
// Tests to check report functionality in assessment module
describe('Back End assesment report data', () => {
  const userId = '-LUuZfxAkNQwtGBpx0DB';
  const userName = 'sagar.vivek159';
  let data = [];
  const ImageList = [];

  const getImageData = (response) => {
    for (const key in response) { if (key) { ImageList.push({ ...response[key], id: key }); } }
  };

  it('proper json response should come from the Firebase', async () => {
    data = await GetImageDataService.fetchUserGetData();
    expect(data).toBeTruthy();
    getImageData(data);
  });
  it('proper Name should come from the firebase', async () => {
    expect(ImageList[0].user).toEqual(userName);
  });
  it('proper ID should come from the firebase', async () => {
    expect(ImageList[0].id).toEqual(userId);
  });
  it('proper Image URL Should be stored to the firebase', async () => {
    expect(ImageList[0].image.imageUrl).toBeTruthy();
  });
});
