import jwt_decode from 'jwt-decode';
import { isPast } from 'date-fns';

export enum UserRole {
  ASI = 'ASI',
  FSC = 'FSC',
  CB = 'CB',
  APPLICANT = 'Applicant',
}

export type UserType = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type TokenType = {
  user: UserType;
  iat: number;
  exp: number;
};

const BASE_URL = 'http://docusignfscserver-env.eba-y94bqrjy.us-east-2.elasticbeanstalk.com/api/auth/';

export const getToken = (): string | null => localStorage.getItem('authToken');
export const getBearerToken = () => `Bearer ${getToken()}`;
export const getTokenDecoded = (): TokenType | null =>
  getToken() ? jwt_decode<TokenType>(getToken() as string) : null;
export const setToken = (token: string) => localStorage.setItem('authToken', token);

export const authenticateUser = async (email: String, password: String) => {
  const { token } = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password: 'password',
    }),
  }).then((res) => res.json());

  setToken(token);

  if (isTokenExpired()) {
    throw 'Token Expired';
  }
};

export const logoutUser = () => localStorage.removeItem('authToken');

export const isTokenExpired = (): boolean => {
  const token = getTokenDecoded();
  if (!token) return true;

  return isPast(new Date(token.exp * 1000 ?? 1));
};

export const isTokenValid = () => !isTokenExpired();
