import React from "react";
import styled from "styled-components";
import { Descriptions } from "antd";
import { format as formateDate } from "date-fns";
import { useCertification } from "store/certification/hooks";

type ProjectSummaryProps = {
  className?: string;
};

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ className }) => {
  const { certificate } = useCertification();

  return (
    <Descriptions size='small' column={3} className={className}>
      <Descriptions.Item label='Name'>
        {certificate?.fsc_name}
      </Descriptions.Item>
      <Descriptions.Item label='Auditor'>
        <a>Greenblocks</a>
      </Descriptions.Item>
      <Descriptions.Item label='Start Date'>
        {certificate &&
          formateDate(new Date(certificate.createdon), "do MMM yyyy")}
      </Descriptions.Item>
      <Descriptions.Item label='Certification Date'>
        {certificate &&
          certificate.fsc_certificatestatus === 2 &&
          formateDate(new Date(certificate.modifiedon), "do MMM yyyy")}
      </Descriptions.Item>
      <Descriptions.Item label='Address'>
        1 Highland Ave, Boston, MA, 02115
      </Descriptions.Item>
    </Descriptions>
  );
};

const StyledProjectSummary = styled(ProjectSummary)`
  background-color: #f2f6fa;
  padding: 12px;
  margin: 24px 0;
  border-radius: 8px;
`;

export default StyledProjectSummary;
