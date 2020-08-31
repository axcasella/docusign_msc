import { CertificationStep } from './types';
import { CertificateType, EvaluationType } from 'services/certification/types';

const defaultState: {
  steps: {
    [key in CertificationStep]: boolean;
  };
  routes: {
    [key in CertificationStep]: string;
  };
  evaluations: EvaluationType[];
  currentStep: CertificationStep;
  activeCertificate?: CertificateType;
} = {
  steps: {
    [CertificationStep.OPEN_MEETING]: false,
    [CertificationStep.SITE_INSPECTION]: false,
    [CertificationStep.EMPLOYEE_INTERVIEW]: false,
    [CertificationStep.OBSERVATIONS]: false,
    [CertificationStep.CLOSE_MEETING]: false,
    [CertificationStep.CERTIFICATION_ISSUE]: false,
  },
  routes: {
    [CertificationStep.OPEN_MEETING]: '',
    [CertificationStep.SITE_INSPECTION]: '',
    [CertificationStep.EMPLOYEE_INTERVIEW]: '',
    [CertificationStep.OBSERVATIONS]: '',
    [CertificationStep.CLOSE_MEETING]: '',
    [CertificationStep.CERTIFICATION_ISSUE]: '',
  },
  evaluations: [],
  currentStep: CertificationStep.OPEN_MEETING,
  activeCertificate: undefined,
};

export default defaultState;
