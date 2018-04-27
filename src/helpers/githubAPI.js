
import AuthenticationService from './authenticationService';
import buffer from 'buffer';
const authService = new AuthenticationService();

class GithubApi {
  constructor() {
    const b = new buffer.Buffer(`user:psw`);
    console.log(b);

    const encodedAuth = b.toString('base64');
    fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Basic ${encodedAuth}`,
      },
    }).then((response) => {
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      throw {
        badCredentials: response.status == 401,
        unknownError: response.status != 401,
      };
    })
      .then(response => response.json())
      .then((results) => {
        console.log("from constr");
        console.log(results);
        localStorage.setItem('auth', encodedAuth);
        localStorage.setItem('user', JSON.stringify(results));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getAuthInfo(cb) {
    const auth = localStorage.getItem('auth');
    const user = localStorage.getItem('user');

    if (!auth || !user) {
      return cb();
    }
    const authInfo = {
      header: {
        Authorization: `Basic ${auth}`,
      },
      user: JSON.parse(user),
    };
    return cb(authInfo);
  }

  getPushEvents() {
    this.getAuthInfo((authInfo) => {
      var url = `https://api.github.com/users/${
        authInfo.user.login
        }/received_events`;
        this.fetchData(url, authInfo);
    });
  }

  fetchData(url, authInfo){
    fetch(url, {
      headers: authInfo.header,
    })
      .then(response =>
        response.json())
      .then((responseData) => {
        const feedItems = responseData.filter(ev =>
          ev.type == 'PushEvent');
        console.log(feedItems);
      });
  }

  // getRepositories() {
  //   authService.getAuthInfo((authInfo) => {
  //     const url = `https://api.github.com/user/repos`;
  //     fetch(url, {
  //       headers: authInfo.header,
  //     })
  //       .then(response =>
  //         response.json())
  //       .then((responseData) => {
  //         console.log(responseData);
  //       });
  //   });
  // }

  // getPushEventById(id) {
  //   authService.getAuthInfo((authInfo) => {
  //     const url = `https://api.github.com/users/${
  //       authInfo.user.login
  //       }/received_events`;
  //   });
  //   fetch(url, {
  //     headers: authInfo.header,
  //   })
  //     .then(response =>
  //       response.json())
  //     .then((responseData) => {
  //       const pushEvent = responseData.filter(ev =>
  //         ev.id == id);
  //       console.log(pushEvent);
  //     });

  // }

  // getAuthorByPushEventId(id) {
  //   console.log(id);
  //   authService.getAuthInfo((authInfo) => {
  //     const url = `https://api.github.com/users/${
  //       authInfo.user.login
  //       }/received_events`;
  //   });
  //   fetch(url, {
  //     headers: authInfo.header,
  //   })
  //     .then(response =>
  //       response.json())
  //     .then((responseData) => {
  //       const pushEvent = responseData.filter(ev =>
  //         ev.id == id);
  //       console.log(pushEvent[0].actor.login);
  //     });
  // }
}


export default GithubApi;
