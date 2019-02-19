
const uploadImageHandler = (uri, update, name) => {
  // console.log('aaa gyayayay');
  const timestamp = (Date.now() / 1000 || 0).toString();
  const apiKey = 792179287924717;
  const cloud = 'pratian-technologies';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
  const uploadPreset = 'trtxfujm';
  const folder = `Zul-Profile-Image/${name}`;
  let array = {};
  const publicId = `${timestamp}`;
  // let api_secret = 'npOpvXMcKTse5XVqbUxMhA-8wko'
  // let hash_string = 'timestamp=' + timestamp + api_secret
  // let signature = ('timestamp=' + timestamp).toString();

  const xhr = new XMLHttpRequest();
  xhr.open('POST', uploadUrl);
  xhr.onload = async () => {
    array = JSON.parse(xhr._response);
    // console.log("array", array)
    const imageDetails = {
      secure_url: array.secure_url,
      public_id: array.public_id,
      created_at: array.created_at
    };
    // console.log("imah", imageDetails)
    // await this.props.updateUserImageDetails(imageDetails)
    update(imageDetails);
  };
  const formdata = new FormData();
  formdata.append('file', { uri, type: 'image/png', name: 'upload.png' });
  formdata.append('timestamp', timestamp);
  formdata.append('api_key', apiKey);
  formdata.append('upload_preset', uploadPreset);
  formdata.append('folder', folder);
  formdata.append('public_id', publicId);
  // formdata.append('signature', signature);

  xhr.send(formdata);
};
export default uploadImageHandler;

// export default connect(null,mapDispatchToProps)(getImageHandler);
// import { Toast } from 'native-base';
// import UserGetImageService from '../../../api/userImage/UserImageGetService';

// const getImageHandler = (userName, UpdateURL) => {
//   const ImageList = [];
//   UserGetImageService.fetchUserGetData()
//     .then((parsedRes) => {
//       for (const key in parsedRes) {
//         if (key) {
//           ImageList.push({
//             ...parsedRes[key],
//             id: key
//           });
//         }
//       }
//     })
//     .then(() => {
//       const data = ImageList;
//       let uri = null;
//       for (let i = 0; i < data.length; i += 1) {
//         if (data[i].user === userName) {
//           uri = data[i].image.imageUrl;
//         }
//       }
//       UpdateURL(uri);
//       // return uri
//     })
//     .catch((error) => {
//       Toast.show({
//         text: error,
//         duration: 2000,
//         type: 'danger'
//       });
//     });
// };
// export default getImageHandler;
