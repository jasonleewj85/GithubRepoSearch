class HttpService {
  get(url, params) {
    let queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    const fullUrl = encodeURI(url + queryParams);
    console.log(fullUrl);
    return fetch(fullUrl)
    .then((response) => response.json())
    .then(responseJson => this.handleSuccessResponse(responseJson))
    .catch((error) =>{
      console.error(error);
    });
  }

  handleSuccessResponse = response => response;

}

export default new HttpService();
