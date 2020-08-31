import React from "react";
import { Typography } from "antd";
import TimelineControl from "./TimelineControl";
import { CertificationStep } from "store/certification/types";
import { ZoomLink } from "components";

const CloseMeeeting = () => (
  <>
    <Typography.Title level={3}>Close Meetings</Typography.Title>
    <Typography.Paragraph>
      The closing meeting will be 30 minutes long. The auditor will present
      evidence and give a summary.
    </Typography.Paragraph>
    <Typography.Paragraph>
      <ZoomLink link='https://zoom.us/j/92401797536' />
    </Typography.Paragraph>
    <TimelineControl step={CertificationStep.CLOSE_MEETING} />
  </>
);

export default CloseMeeeting;
