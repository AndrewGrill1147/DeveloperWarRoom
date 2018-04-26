//const buffer = require('buffer');
import buffer from 'buffer';

class AuthenticationService {
  constructor(){
      
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


  login(cb) {
    //hard coded
    const b = new buffer.Buffer(`andy-keene:CxS-ftz-too-fB9`);

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
        console.log(results);
        localStorage.setItem('auth', encodedAuth);
        localStorage.setItem('user', JSON.stringify(results));
        return cb({ success: true });
      })
      .catch(error => cb(error));
  }
}


export default AuthenticationService;
