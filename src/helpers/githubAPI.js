
import AuthenticationService from './authenticationService';
import buffer from 'buffer';
const authService = new AuthenticationService();

class GithubApi {

  constructor() {
    this.username = 'GroupCWR';
    this.password = 'GroupCWR000';
    this.creds = new buffer.Buffer(`${this.username}:${this.password}`).toString('base64');
    this.headers = {
      Authorization: `Basic ${this.creds}`
    };
    this.isAuthenticated = false;

    console.log('creds ', this.creds);

    this.get('https://api.github.com/user', this.setAuth.bind(this));
  }

  setAuth(resp) {
    this.isAuthenticated = resp.success;
    console.log('Authenticated = ', this.isAuthenticated);
  }

  getRepos(callback) {
    const url = `https://api.github.com/user/repos`;
    this.get(url, callback);
  }

  getPushEvents() {
    let url = `https://api.github.com/users/${this.username}/received_events`;
    
  }

  getPullRequestById(id) {
    const url = `https://api.github.com/users/${authInfo.user.login}/received_events`;
  }

  /* Get url and return Error or Data to call back */
  get(url, callback) {
    fetch(url, {
      headers: this.headers
    }).then( response => {
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      throw {
        badCredentials: response.status == 401,
        unknownError: response.status != 401,
      };
    }).then(response => {
      return response.json()
    })
    .then(response => {
      console.log('Success ', response);
      // return to caller, success!
      callback( {
        success: true,
        data: response,
        error: {}
      });
    }).catch(function (error) {
      callback( {
        success: false,
        data: {},
        error: error
      });
      console.log('error ', error);
    });
  }
}

export default GithubApi;
