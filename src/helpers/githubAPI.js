
import buffer from 'buffer';

class GithubApi {
  constructor() {
    this.username = 'GroupCWR';
    this.password = 'GroupCWR000';
    this.creds = new buffer.Buffer(`${this.username}:${this.password}`).toString('base64');
    this.headers = {
      Authorization: `Basic ${this.creds}`,
    };
    this.isAuthenticated = false;

    this.get('https://api.github.com/user', this.setAuth.bind(this));
  }

  setAuth(resp) {
    this.isAuthenticated = resp.success;
    // console.log('Authenticated = ', this.isAuthenticated);
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
        callback({
          success: true,
          data: response,
          error: {},
        });
      })
      .catch((error) => {
        callback({
          success: false,
          data: {},
          error,
        });
      });
  }
}

export default GithubApi;
