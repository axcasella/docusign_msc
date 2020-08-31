import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { ZoomLink, DocusignLogin } from "components";
import TimelineControl from "./TimelineControl";
import { ReactComponent as MeetingSVG } from "assets/meeting.svg";
import { CertificationStep } from "store/certification/types";
import { useAuth } from "services/auth";
import { getInitialCertificateUrl, useDocusign } from "services/docusign";
import { UserRole } from "services/auth/auth.service";

const OpenMeeting = () => {
  const [url, setUrl] = useState("");
  const { user } = useAuth();
  const { isAuth } = useDocusign();

  useEffect(() => {
    if (!user) return;
    getInitialCertificateUrl(user.name, user.email).then(setUrl);
  }, [user]);

  return (
    <>
      <Typography.Title level={3}>Open Meeting</Typography.Title>
      <Typography.Paragraph>
        The opening meeting will be 30 minutes long. The company and the auditor
        will discuss audit results from the previous years and agree on audit
        procedures.
      </Typography.Paragraph>
      <Typography.Paragraph>
        <MeetingSVG width='256' height='256' />
      </Typography.Paragraph>
      {user?.role === UserRole.APPLICANT && (
        <Typography.Paragraph>
          {isAuth ? (
            <a href={url} target='_blank' rel='noopener noreferrer'>
              Sign FSC Trademark License Agreement
            </a>
          ) : (
            <DocusignLogin />
          )}
        </Typography.Paragraph>
      )}
      <Typography.Paragraph>
        <ZoomLink link='https://zoom.us/j/92401797536' />
      </Typography.Paragraph>
      <TimelineControl step={CertificationStep.OPEN_MEETING} />
    </>
  );
};

export default OpenMeeting;
