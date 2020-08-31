import React from "react";
import { Typography, Row, Col, Checkbox } from "antd";
import TimelineControl from "./TimelineControl";
import { CertificationStep } from "store/certification/types";
import { ZoomLink } from "components";

const PEOPLE_INFO = [
  { label: "Jim Halpert", value: "Liam.Welsh@gmail.com" },
  { label: "Pam Beesly", value: "Emma.Titer@gmail.com" },
  { label: "Dwight Schrute", value: "Noah.Hanes@gmail.com" },
  { label: "Kelly Kapoor", value: "Olivia.Richmond@gmail.com" },
  { label: "Ryan Howard", value: "William.Trois@gmail.com" },
  { label: "Kevin Malone", value: "Ava.Potter@gmail.com" },
];

const Interviews = () => (
  <>
    <Typography.Title level={3}>Employee Interviews</Typography.Title>
    <Row>
      <Col md={{ span: 8 }}>
        {PEOPLE_INFO.map(({ label, value }) => (
          <div key={value}>
            <Checkbox name={value}>{label}</Checkbox>
          </div>
        ))}
      </Col>
      <Col md={{ span: 16 }}>
        <Typography.Paragraph>
          Each of the following employees will be interviewed. Interviews may be
          done 1 on 1 or in a group.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <ZoomLink link='https://zoom.us/j/92401797536' />
        </Typography.Paragraph>
      </Col>
    </Row>
    <TimelineControl step={CertificationStep.EMPLOYEE_INTERVIEW} />
  </>
);

export default Interviews;
