import * as auth from 'services/auth/auth.service';

const GET_URL_EVAL =
  'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/evaluation/certificate/%certid%';
const POST_URL_EVAL = 'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/evaluation/';

// Evaluations
export const getEvaluations = (certId: string) =>
  fetch(GET_URL_EVAL.replace('%certid%', certId), {
    method: 'GET',
    headers: {
      Authorization: auth.getBearerToken(),
      Accept: 'application/json',
    },
  }).then((res) => res.json());

export const addNewEvaluation = (certId: string, evidence: string, comment: string) =>
  fetch(POST_URL_EVAL.replace('%certid%', certId), {
    method: 'POST',
    headers: {
      Authorization: auth.getBearerToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date_from: new Date().toISOString(),
      date_to: new Date().toISOString(),
      certificate_id: certId,
      evaluation_name: evidence,
      evaluation_comment: comment,
      auditor_name: 'Tom',
    }),
  }).then((res) => res.json());
