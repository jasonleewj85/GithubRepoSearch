import httpService from 'services/httpService';

class githubApi {
  static getRepositories(params) {
    return httpService.get('https://api.github.com/search/repositories?', params);
  }
}

export default githubApi;
