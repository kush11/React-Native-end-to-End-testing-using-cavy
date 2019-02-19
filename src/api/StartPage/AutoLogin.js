import { Toast } from 'native-base';
import { BASE_URL, headers } from '../config/Config';

export default class AutoLogin {
  static autoLogin = token1 => fetch(`${BASE_URL}/api/autoLogin`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ token: token1, })
  }).then(response => response.json()).catch((error) => {
    Toast.show({
      text: error,
      duration: 2000,
      type: 'default'
    });
  })
}
