import httpService from 'services/httpService';
// import { API } from 'constants';

class githubApi {
  static getRepositories(params) {
    // return fetch('https://facebook.github.io/react-native/movies.json')
    // .then((response) => response.json())
    // .then((responseJson) => {
    //     console.log(responseJson)

    // //   this.setState({
    // //     isLoading: false,
    // //     dataSource: responseJson.movies,
    // //   }, function(){

    // //   });

    // })
    // .catch((error) =>{
    //   console.error(error);
    // });
    return httpService.get('https://api.github.com/search/repositories?', params);
    // return 'AAA';
  }

//   static getAccountMainV3(bypass) {
//     return httpService.get(API.endpoints.getAccountMainV3, null, bypass);
//   }

//   static getNonOwnerAccountManageVerification(params) {
//     return httpService.get(API.endpoints.getNonOwnerAccountManageVerification, params);
//   }

//   static requestUpdateNickname(params) {
//     return httpService.post(API.endpoints.requestUpdateNickname, params);
//   }

//   static requestUpdateBillingEmail(params) {
//     return httpService.post(API.endpoints.requestUpdateBillingEmail, params);
//   }

//   static requestUpdateAddOn(params) {
//     return httpService.post(API.endpoints.requestUpdateAddOn, params);
//   }

//   static requestPhoneSettings(params) {
//     return httpService.post(API.endpoints.requestPhoneSettings, params);
//   }

//   static requestIREligibility(params) {
//     return httpService.post(API.endpoints.requestIREligibility, params);
//   }

//   static requestNonOwnerAccount(params) {
//     return httpService.post(API.endpoints.requestNonOwnerAccount, params);
//   }
}

export default githubApi;
