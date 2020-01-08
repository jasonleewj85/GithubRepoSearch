class HttpService {
  get(url, params) {
    let queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    console.log(url);
    console.log(queryParams);
    const fullUrl = encodeURI(url + queryParams);
    console.log(fullUrl);
    return fetch(fullUrl)
    .then((response) => response.json())
    .then(responseJson => this.handleSuccessResponse(responseJson))
    .catch((error) =>{
      console.error(error);
    });
    return null;
  }

//   post(url, data) {
//     return this.http
//       .request({
//         method: 'POST',
//         url,
//         responseType: 'json',
//         // baseURL: isPRD ? API.prodBaseURL : API.preprodBaseURL,
//         data,
//         headers: nonOwnerFlag ? { IsNonOwner: nonOwnerFlag } : {},
//       })
//       .then(response => this.handleSuccessResponse(response))
//       .catch(error => this.handleFailResponse(error));
//   }

  handleSuccessResponse = response => response;

  handleFailResponse = error => Promise.reject(error);
}

export default new HttpService();
