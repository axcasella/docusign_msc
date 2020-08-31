import React from 'react';
import { DOCUSIGN_OAUTH_URL } from 'services/docusign';
import { Button } from 'antd';
import { UnlockOutlined } from '@ant-design/icons';

const DocusignLogin = () => {
  const authorize = () => {
    window.location.href = DOCUSIGN_OAUTH_URL;
  };

  return (
    <Button size="middle" onClick={authorize} icon={<UnlockOutlined />}>
      Login with Docusign
    </Button>
  );
};

export default DocusignLogin;