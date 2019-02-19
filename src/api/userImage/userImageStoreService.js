export default class GetUserImagePostData {
  static fetchUserStoreData = userImage => fetch('https://profile-image-be7aa.firebaseio.com/profile_image.json', {
    method: 'POST',
    body: JSON.stringify(userImage)
  })
}
