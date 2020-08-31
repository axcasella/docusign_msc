const BASE_URL_ORG = 'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/org';

// Evaluations
export const getOrgs = () =>
  fetch(BASE_URL_ORG, {
    method: 'GET',
  }).then((res) => res.json());
