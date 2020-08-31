import React, { useState, useEffect } from 'react';
import { Typography, Button } from 'antd';
import TimelineControl from './TimelineControl';
import { CertificationStep } from 'store/certification/types';
import { ExportOutlined } from '@ant-design/icons';
import { useDocusign, getFinalCertificateUrl } from 'services/docusign';

import { useAuth } from 'services/auth';
import { useCertification } from 'store/certification/hooks';
import { UserRole } from 'services/auth/auth.service';
import { DocusignLogin } from 'components';

const CertificateIssueContainer = () => {
  const { user } = useAuth();

  return (
    <>
      {user?.role === UserRole.APPLICANT ? <CertificateApplicantView /> : <CertificateNonApplicantView />}
      <TimelineControl step={CertificationStep.CERTIFICATION_ISSUE} />
    </>
  );
};

const CertificateApplicantView = () => {
  const { isComplete } = useCertification();
  return <>{isComplete ? 'Certificate Received' : 'Certificate signing in progress'}</>;
};

const CertificateNonApplicantView = () => {
  const { isAuth } = useDocusign();

  return (
    <>
      <Typography.Title level={3}>Certificate Issue</Typography.Title>
      {isAuth ? <CertificateIssue /> : <DocusignLogin />}
    </>
  );
};

const CertificateIssue = () => {
  const [url, setUrl] = useState('');
  const { user } = useAuth();
  const { markAsCompleted, isComplete } = useCertification();

  useEffect(() => {
    if (!user) return;
    getFinalCertificateUrl(user.name, user.email).then(setUrl);
  }, [user]);

  return (
    <>
      <p>Logged into Docusign</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        FSC Certificate&nbsp;
        <ExportOutlined />
      </a>
      <br />
      <br />
      <Button size="small" disabled={isComplete} onClick={() => markAsCompleted()}>
        Mark as Completed
      </Button>
    </>
  );
};

export default CertificateIssueContainer;
