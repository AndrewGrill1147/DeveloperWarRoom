
import AuthenticationService from './authenticationService';
const authService = new AuthenticationService();

class GithubApi {

  getPushEvents() {
    authService.getAuthInfo((authInfo) => {
      const url = `https://api.github.com/users/${
        authInfo.user.login
      }/received_events`;
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
    });
  }

  getRepositories() {
    authService.getAuthInfo((authInfo) => {
      const url = `https://api.github.com/user/repos`;
      fetch(url, {
        headers: authInfo.header,
      })
      .then(response =>
          response.json())
      .then((responseData) => {
          console.log(responseData);
        });
    });
  }

  getPushEventById(id) {
    console.log(`hahaha${id}`);
    authService.getAuthInfo((authInfo) => {
      const url = `https://api.github.com/users/${
        authInfo.user.login
      }/received_events`;
      fetch(url, {
        headers: authInfo.header,
      })
        .then(response =>
          response.json())
        .then((responseData) => {
          const pushEvent = responseData.filter(ev =>
            ev.id == id);
          console.log(pushEvent);
        });
    });
  }

  getAuthorByPushEventId(id) {
    console.log(id);
    authService.getAuthInfo((authInfo) => {
      const url = `https://api.github.com/users/${
        authInfo.user.login
      }/received_events`;
      fetch(url, {
        headers: authInfo.header,
      })
        .then(response =>
          response.json())
        .then((responseData) => {
          const pushEvent = responseData.filter(ev =>
            ev.id == id);
          console.log(pushEvent[0].actor.login);
        });
    });
  }
}


export default GithubApi;
