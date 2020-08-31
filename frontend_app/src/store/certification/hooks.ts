import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as CertActions from './actions';
import * as EvaluationService from 'services/certification/evaluation.service';
import { CertificationStep, StepRoutes } from './types';
import { RootState } from 'store/types';
import { useAuth } from 'services/auth';
import { UserRole } from 'services/auth/auth.service';
import { markAsCertCompleted } from 'services/certification';

export const useCertificationStep = () => {
  const routes = useSelector((state: RootState) => state.cert.routes);
  const currentStep = useSelector((state: RootState) => state.cert.currentStep);
  const stepStatus = useSelector((state: RootState) => state.cert.steps);

  const dispatch = useDispatch();

  const setRoutes = (routes: StepRoutes) => dispatch(CertActions.setStepRoutes(routes));
  const setCurrentStep = (step: CertificationStep) => dispatch(CertActions.setCurrentStep(step));
  const setStepStatus = (...args: [CertificationStep, boolean]) => dispatch(CertActions.setStepStatus(...args));

  return {
    routes,
    setRoutes,
    stepStatus,
    setStepStatus,
    currentStep,
    setCurrentStep,
  };
};

export const useCertification = () => {
  const dispatch = useDispatch();
  const certificate = useSelector((state: RootState) => state.cert.activeCertificate);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    dispatch(CertActions.loadOrCreateCertification());
  }, []);

  useEffect(() => {
    if (!certificate) setIsComplete(false);
    else setIsComplete(certificate.fsc_certificatestatus === 2);
  }, [certificate]);

  const markAsCompleted = useCallback(() => {
    if (certificate) {
      markAsCertCompleted(certificate.fsc_fsccertificateid);
    }
    setTimeout(() => dispatch(CertActions.loadOrCreateCertification()), 2000);
  }, [certificate]);

  return {
    certificate,
    isComplete,
    markAsCompleted,
  };
};

export const useEvaluations = () => {
  const { user } = useAuth();
  const { certificate } = useCertification();
  const dispatch = useDispatch();
  const evaluations = useSelector((state: RootState) => state.cert.evaluations);

  useEffect(() => {
    if (certificate && user?.role !== UserRole.APPLICANT) {
      dispatch(CertActions.loadEvaluations(certificate.fsc_fsccertificateid));
    }
  }, [certificate, user]);

  const postEvaluation = async (evidence: string, comment: string) => {
    if (!certificate) return;
    console.log('posting');
    const res = await EvaluationService.addNewEvaluation(certificate.fsc_fsccertificateid, evidence, comment);
    console.log(res);
    setTimeout(() => {
      // Dynamic seems to have a replica lag in their DB
      dispatch(CertActions.loadEvaluations(certificate.fsc_fsccertificateid));
    }, 1000);
    console.log('dispatched');
  };

  return {
    evaluations,
    postEvaluation,
  };
};
