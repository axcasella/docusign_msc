import { addSeconds, isBefore, parseISO } from 'date-fns';
import axios from 'axios';

import {
  DOCUSIGN_TOKENS_KEY,
  DOCUSIGN_EXCHANGE_TOKEN_URL,
  DOCUSIGN_USERINFO_URL,
  CERTIFICATE_INITIAL_URL,
  CERTIFICATE_FINAL_URL,
} from './constants';

export const setToken = (code: string) => localStorage.setItem(DOCUSIGN_TOKENS_KEY, JSON.stringify(code));

export const getToken = () => JSON.parse(localStorage.getItem(DOCUSIGN_TOKENS_KEY) ?? '{}');

export const isAuth = (): boolean => {
  const token = getToken();

  return isBefore(new Date(), parseISO(token.expiresAt));
};

export const getAccessToken = () => getToken().access_token;

export const exchangeForToken = (code: string) =>
  fetch(DOCUSIGN_EXCHANGE_TOKEN_URL, {
    headers: {
      code,
    },
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .then((data) =>
      setToken({
        ...data,
        expiresAt: addSeconds(new Date(), data.expires_in ?? 0),
      })
    );

export const getUserData = () =>
  fetch(DOCUSIGN_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  }).then((res) => res.json());

export const getInitialCertificateUrl = (signerName: string, signerEmail: string) =>
  axios({
    method: 'POST',
    url: CERTIFICATE_INITIAL_URL,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    data: {
      signerName,
      signerEmail,
    },
  }).then((res) => res.data.url);

export const getFinalCertificateUrl = (signerName: string, signerEmail: string) =>
  axios({
    method: 'POST',
    url: CERTIFICATE_FINAL_URL,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    data: {
      signerName,
      signerEmail,
    },
  }).then((res) => res.data.url);
