import { useState, useEffect } from 'react';
import * as DocusignService from './docusign.service';

export const useDocusign = () => {
  const [isAuth, setIsAuth] = useState(false);

  const checkIsAuth = () => {
    if (isAuth !== DocusignService.isAuth()) {
      setIsAuth(!isAuth);
    }
  };

  useEffect(checkIsAuth, []);

  window.addEventListener('storage', () => checkIsAuth);

  return { isAuth };
};
