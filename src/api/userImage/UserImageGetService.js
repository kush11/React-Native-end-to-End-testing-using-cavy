export default class GetUserImageData {
  static fetchUserGetData = () => fetch('https://profile-image-be7aa.firebaseio.com/profile_image.json', { method: 'GET' })
    .then(res => res.json())
}
