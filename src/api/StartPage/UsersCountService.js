import { Toast } from 'native-base';
import { BASE_URL, headers } from '../config/Config';

export default class GetUserCountService {
  static fetchUsersCount = () => {
    const requestUrl = `${BASE_URL}/api/userCount`;
    return fetch(requestUrl, {
      method: 'GET',
      headers
    }).then(response => response.json()).catch((error) => {
      Toast.show({
        text: error,
        duration: 2000,
        type: 'default'
      });
    });
  }
}
