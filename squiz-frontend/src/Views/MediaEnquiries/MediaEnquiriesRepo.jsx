// firebase
import firebase from 'lib/firebase';
import moment from 'moment';

// for date and time

export const submitMediaQueryForm = data => {
  const mediaRef = firebase
    .firestore()
    .collection('/admin/public_website/media_enquiries')
    .doc();
  data.timestamp = {
    epoch: moment.utc().valueOf(),
    iso_8601_datetime_tz: moment.utc().toISOString()
  };
  data.id = mediaRef.id;

  return mediaRef.set(data, { merge: true }).then(resp => {
    return resp;
  });
};
