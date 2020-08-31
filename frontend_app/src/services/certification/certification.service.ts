import * as auth from 'services/auth/auth.service';
import { CertificateType } from 'services/certification/types';

const BASE_URL_CERT = 'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/certificate/';

// Certificates
export const getCertificates = (): Promise<CertificateType[]> =>
  fetch(BASE_URL_CERT, {
    method: 'GET',
  }).then((res) => res.json());

export const getActiveCertificate = () => getCertificates().then((certs) => certs.find((c) => c.statuscode === 1));

export const addNewCertificate = () =>
  fetch(BASE_URL_CERT, {
    method: 'POST',
    headers: {
      Authorization: auth.getBearerToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ch_account_id: '7563950c-f3cc-ea11-a814-000d3a579ccc',
      cb_account_id: '7363950c-f3cc-ea11-a814-000d3a579ccc',
      number_of_group_members: 20,
      cert_name: 'FSC Certificate 123',
      cert_number: '123',
    }),
  }).then((res) => res.json());

export const markAsCertCompleted = (certId: string) =>
  fetch(new URL(`./${certId}/issue`, BASE_URL_CERT).href, {
    method: 'POST',
    headers: {
      Authorization: auth.getBearerToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
