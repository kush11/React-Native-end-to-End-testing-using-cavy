import 'isomorphic-fetch';
import { saveLoginInfo, isTouchIdEnabled, getLoggedInUserName } from '../../repository/login/LoginRepository';
// Tests to check whether the core repositories are working or not
describe('Login Credentials data check', () => {
  // request object
  const requestData = {
    name: 'test_user',
    passcode: '1234',
    enableTouchId: 'true'
  };


  it('data should be saved in device successfully', async () => {
    const data = await saveLoginInfo(requestData);
    expect(data).toBeTruthy();
  });
  it('enable touch id should be as per the saved value', () => {
    isTouchIdEnabled().then((isTouch) => {
      expect(isTouch).toEqual(true);
    });
  });
  it('user name should be as per the saved value', () => {
    getLoggedInUserName().then((userName) => {
      expect(userName).toEqual(`${requestData.name}0`);
    });
  });
});
