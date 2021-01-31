import { createFacebookCredential, firebaseAuth } from 'lib/firebase/auth';
import LegacyAuth from './Legacy';

const FACEBOOK_SCOPE = 'public_profile,email';

export function getLoginConfig(rerequest: any) {
  if (rerequest) return { scope: FACEBOOK_SCOPE, auth_type: 'rerequest' };

  return { scope: FACEBOOK_SCOPE };
}

/**
 * login with data from window.FB.login() and from /me api
 * eg. window.FB.api('/me', { fields: 'email, name' }, function (user) {
 *      var data = {
 *        email: user.email,
 *        name: user.name,
 *        fb_ref_id: response.authResponse.accessToken,
 *        fb_id: user.id,
 *        picture_url: 'http://graph.facebook.com/v2.9/' + user.id + '/picture?type=large',
 *        web: true
 *      }
 *
 * Note: This function returns Promise.all() so caller should expecting 2 results.
 */
export async function login(data: any) {
  return LegacyAuth.signinFacebookMigrate(data).then(resp => {
    const resp_data = resp.data;

    let isNewPromise = Promise.resolve(false);
    if (resp_data.result && resp_data.result.is_new) {
      isNewPromise = Promise.resolve(true);
    }

    if (resp_data.result && resp_data.result.type === 'CUSTOM_AUTH') {
      // service returns Firebase custom auth.
      const customAuth = resp_data.result.custom_auth;
      return Promise.all([
        loginWithFirebaseCustomAuth(customAuth, data),
        isNewPromise
      ]);
    }
    if (resp_data.result && resp_data.result.type === 'USER_RECORD') {
      // service return Firebase user (already linked to FB) - login using FB to firebase.
      return Promise.all([loginWithFirebaseFBAuth(data), isNewPromise]);
    }
    throw new Error('Login unsuccessful');
  });
}

async function loginWithFirebaseFBAuth(data: any) {
  const fbCredential = createFacebookCredential(data.fb_ref_id);
  return firebaseAuth
    .signInWithCredential(fbCredential)
    .then(res => rubyFacebookLogin(data));
}

async function loginWithFirebaseCustomAuth(customAuth: any, data: any) {
  return firebaseAuth
    .signInWithCustomToken(customAuth)
    .then(res => {
      // Link to FB, if success then do: FB Login to ruby so we get the sessions.
      const fbCredential = createFacebookCredential(data.fb_ref_id);
      return (
        firebaseAuth.currentUser &&
        firebaseAuth.currentUser.linkWithCredential(fbCredential)
      );
    })
    .then(res => rubyFacebookLogin(data));
}

async function rubyFacebookLogin(data: any) {
  return LegacyAuth.facebookLogin(data)
    .then(res => {
      return { id: res.data.data.id, email: data.email };
    })
    .catch(err => {
      firebaseAuth.signOut();
      throw err;
    });
}
