export default class GetFacebookInfoService {
  static fetchFacebookInfo = (accessToken) => {
    const requestUrl = `https://graph.facebook.com/v2.5/me?fields=email,name,friends,picture.type(large)&access_token=${accessToken}`;
    return fetch(requestUrl)
      .then(response => response.json());
  }
}
