
import buffer from 'buffer';

class GithubAPI {
  constructor(username, oathToken) {
    /*
    this.username = 'andy-keene';
    this.password = '84d0b85f5fb66e37b2a15061f35485c5701a2a8f';
    this.creds = new buffer.Buffer(`${this.username}:${this.password}`).toString('base64');
    this.headers = {
      Authorization: `Basic ${this.creds}`,
    };
    */
    this.isAuthenticated = false;    
    this.setCredentials(username || '', oathToken || '')
  }

  setCredentials(username, oathToken) {
    this.username = username;
    this.creds = new buffer.Buffer(`${username}:${oathToken}`).toString('base64');
    this.headers = {
      Authorization: `Basic ${this.creds}`,
    };
    // check the auth piece
    this.get('https://api.github.com/user', this.setAuth.bind(this));    
  }

  setAuth(resp) {
    this.isAuthenticated = resp.success;
  }

  getRepos(callback) {
    const url = 'https://api.github.com/user/repos';
    this.get(url, callback);
  }

  getPullRequestsByRepo(callback, reponame, owner) {
    const url = `https://api.github.com/repos/${owner}/${reponame}/pulls`;
    this.get(url, callback);
  }

  getPushEvents() {
    const url = `https://api.github.com/users/${this.username}/received_events`;
  }

  getPullRequestById(id) {
    const url = `https://api.github.com/users/${this.username}/received_events`;
  }

  /* Get url and return Error or Data to call back */
  get(url, callback) {
    fetch(url, {
      headers: this.headers,
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      throw {
        badCredentials: response.status === 401,
        unknownError: response.status !== 401,
      };
    }).then(response => response.json())
      .then((response) => {
      // return to caller, success!
        this.isAuthenticated = true,      
        callback({
          success: true,
          data: response,
          error: {},
        });
      })
      .catch((error) => {
        this.isAuthenticated = false,
        callback({
          success: false,
          data: {},
          error,
        });
      });
  }
}

export default GithubAPI;
