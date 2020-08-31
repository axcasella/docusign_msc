import React from "react";
import { Typography } from "antd";
import TimelineControl from "./TimelineControl";
import { CertificationStep } from "store/certification/types";
import { ZoomLink } from "components";

const SiteInspection = () => (
  <>
    <Typography.Title level={3}>Site Inspection</Typography.Title>
    <Typography.Paragraph>
      The auditor will inspect all the machines for safety comliance and working
      conditions.
    </Typography.Paragraph>
    {/* <Typography.Paragraph>
      <MeetingSVG width="256" height="256" />
    </Typography.Paragraph> */}
    <Typography.Paragraph>
      <ZoomLink link='https://zoom.us/j/92401797536' />
    </Typography.Paragraph>
    <TimelineControl step={CertificationStep.SITE_INSPECTION} />
  </>
);

export default SiteInspection;
