import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { exchangeForToken } from 'services/docusign';
import { useAuth } from 'services/auth';
import { UserRole } from 'services/auth/auth.service';

const DocusignAuth = () => {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return;
    setCode(code);
  }, []);

  useEffect(() => {
    // Exchange code to token
    if (!code) return;
    if (!user) return;

    exchangeForToken(code).then(() => {
      if (user.role === UserRole.APPLICANT) {
        history.push('/certification/open');
      } else {
        history.push('/certification/certissue');
      }
    });
  }, [code, user]);

  return null;
};

export default DocusignAuth;
