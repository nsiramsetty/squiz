import { firebaseAuth } from 'lib/firebase/auth';
import LegacyAuth from './Legacy';


/**
 * Login via email + password, then login via legacy authentication.
 */
export async function login(
  email: string,
  passwd: string,
  afterMigration = false
): Promise<any> {
  return firebaseAuth.signInWithEmailAndPassword(email, passwd)
    .then((res: any) => legacyLogin(email, passwd))
    .catch((err: any) => {
      if (err.code === 'auth/user-not-found' && !afterMigration) {
        return signinMigration(email, passwd);
      }
      throw err;
    });
}

async function legacyLogin(email: string, passwd: string) {
  return LegacyAuth.passwordLogin(email, passwd, true)
    .then((resp: any) => {
      return { email, id: resp.data.data.id };
    })
    .catch((err: any) => {
      // Firebase login success, but not legacy login, then we need to logout from firebase.
      firebaseAuth.signOut();
      throw err;
    });
}

async function signinMigration(email: string, passwd: string) {
  return LegacyAuth.signinMigrate(email, passwd).then((resp: any) => {
    const { data } = resp;
    // migration error
    if (data.insight_error_code != null) {
      throw new Error(data.insight_error_code);
    } else {
      // migration success, call firebase login + legacy login again.
      if (data.result != null && data.result.uid != null) {
        return login(email, passwd, true);
      }
      throw new Error('AUTHENTICATION_FAILED');
    }
  });
}

/**
 * register
 * eg.  var data = {
 *        pwd: "",
 *        name: "",
 *        email: "",
 *        attribution_influencer_id: "",
 *        attribution_channel: "",
 *        attribution_feature: ""
 *      }
 */
export async function register(data: any) {
  return LegacyAuth.registerMigrate(data).then((resp: any) => {
    if (resp.data && resp.data.insight_error_code) {
      throw new Error(resp.data.insight_error_code);
    } else {
      return login(data.email, data.pwd, true);
    }
  });
}
