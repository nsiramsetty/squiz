import axios from 'axios';
import * as Config from '../../Config/constants';

export default {
  passwordLogin: (email: string, password: string, web: boolean) => {
    console.info(Config.WEB_HOST);
    return axios({
      method: 'post',
      url: `${Config.WEB_HOST}/user/signin`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data: {
        email,
        pwd: password,
        web
      }
    });
  },

  facebookLogin: (data: any) => {
    return axios({
      method: 'post',
      url: `${Config.WEB_HOST}/user/login_fb`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      data
    });
  },

  signinMigrate: (email: string, password: string) => {
    return axios({
      method: 'post',
      url: `${Config.API_HOST}/auth/v1/user/signin_migrate`,
      headers: { 'Content-Type': 'application/json' },
      data: {
        email,
        pwd: password
      }
    });
  },

  signinFacebookMigrate: (data: any) => {
    return axios({
      method: 'post',
      url: `${Config.API_HOST}/auth/v1/user/signin_facebook_migrate`,
      headers: { 'Content-Type': 'application/json' },
      data
    });
  },

  registerMigrate: (data: any) => {
    return axios({
      method: 'post',
      url: `${Config.API_HOST}/auth/v1/user/register_migrate`,
      headers: { 'Content-Type': 'application/json' },
      data
    });
  }
};
