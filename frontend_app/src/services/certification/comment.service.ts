import * as auth from 'services/auth/auth.service';

const BASE_URL_COMT_GET =
  'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/certificate/%certid%/comments';
const BASE_URL_COMT_ADD =
  'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/certificate/%certid%/add_comment';


export const getComments = (certId: string) =>
  fetch(BASE_URL_COMT_GET.replace('%certid%', certId), {
    method: 'GET',
    headers: {
      Authorization: auth.getBearerToken(),
    },
  }).then((res) => res.json());

export const addNewComment = (certId: string, comment: string) =>
  fetch(BASE_URL_COMT_ADD.replace('%certid%', certId), {
    method: 'POST',
    headers: {
      Authorization: auth.getBearerToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment,
    }),
  }).then((res) => res.json());
