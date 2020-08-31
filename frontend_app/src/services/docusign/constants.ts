const REDIRECT_URI = `${window.location.origin}/signingComplete`;

export const DOCUSIGN_OAUTH_URL = `https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature&client_id=08ecb933-13e3-45e7-aed3-090418488db8&redirect_uri=${REDIRECT_URI}`;
export const DOCUSIGN_EXCHANGE_TOKEN_URL =
  'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/docusign/token';
export const DOCUSIGN_USERINFO_URL = 'https://account-d.docusign.com/oauth/userinfo';
export const DOCUSIGN_TOKENS_KEY = 'docusignCode';

export const CERTIFICATE_INITIAL_URL =
  'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/docusign/agreement';

export const CERTIFICATE_FINAL_URL =
  'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/docusign/final_certificate';
