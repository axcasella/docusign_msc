import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from 'antd';

import { CertificationStep } from 'store/certification/types';
import { useCertificationStep } from 'store/certification/hooks';

const CERTIFICATION_PROCESS_ORDER = [
  CertificationStep.OPEN_MEETING,
  CertificationStep.SITE_INSPECTION,
  CertificationStep.EMPLOYEE_INTERVIEW,
  CertificationStep.OBSERVATIONS,
  CertificationStep.CLOSE_MEETING,
  CertificationStep.CERTIFICATION_ISSUE,
];

const ControlButton = styled(Button)`
  margin-right: 12px;
`;

interface ITimeLineControl extends React.HTMLAttributes<HTMLDivElement> {
  step: CertificationStep;
}

const TimelineControl: React.FC<ITimeLineControl> = ({ step, ...props }) => {
  const history = useHistory();
  const certSteps = useCertificationStep();

  useEffect(() => {
    certSteps.setCurrentStep(step)
  }, [step]);

  const onPrevious = () => {
    const currIndex = CERTIFICATION_PROCESS_ORDER.indexOf(step);
    const prevRoute = certSteps.routes[CERTIFICATION_PROCESS_ORDER[currIndex - 1]];

    history.push(prevRoute);
  };

  const onStepFinish = () => {
    certSteps.setStepStatus(step, true)

    const currIndex = CERTIFICATION_PROCESS_ORDER.indexOf(step);
    const nextRoute = certSteps.routes[CERTIFICATION_PROCESS_ORDER[currIndex + 1]];

    history.push(nextRoute);
  };

  return (
    <div {...props}>
      <ControlButton onClick={onPrevious}>Previous</ControlButton>
      <ControlButton type="primary" onClick={onStepFinish}>
        Done
      </ControlButton>
    </div>
  );
};

export default styled(TimelineControl)`
  margin-top: 2em;
`;
