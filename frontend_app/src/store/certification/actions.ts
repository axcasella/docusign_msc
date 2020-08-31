import { ThunkDispatch } from 'redux-thunk';
import { ActionType } from './';
import {
  CertificationStep,
  CompleteStepAction,
  SetStepRoutesAction,
  SetCurrentStepAction,
  LoadCertificationAction,
  LoadEvaluationsAction,
} from './types';

import * as certification from 'services/certification/certification.service';
import * as evaluation from 'services/certification/evaluation.service';

export const setStepStatus = (step: CertificationStep, status: boolean) => (
  dispatch: ThunkDispatch<{}, {}, CompleteStepAction>
) =>
  Promise.resolve(
    dispatch({
      type: ActionType.COMPLETE_STEP,
      payload: { step, status },
    })
  );

export const setStepRoutes = (stepRoutes: SetStepRoutesAction['payload']) => (
  dispatch: ThunkDispatch<{}, {}, SetStepRoutesAction>
) =>
  dispatch({
    type: ActionType.SET_STEP_ROUTES,
    payload: stepRoutes,
  });

export const setCurrentStep = (step: CertificationStep) => (dispatch: ThunkDispatch<{}, {}, SetCurrentStepAction>) =>
  dispatch({
    type: ActionType.SET_CURRENT_STEP,
    payload: { step },
  });

export const loadOrCreateCertification = () => async (dispatch: ThunkDispatch<{}, {}, LoadCertificationAction>) => {
  let cert = await certification.getActiveCertificate();

  if (!cert) {
    await certification.addNewCertificate();
    cert = await certification.getActiveCertificate();
  }

  if (!cert) {
    return;
  }

  dispatch({
    type: ActionType.LOAD_CERTIFICATION,
    payload: {
      cert,
    },
  });
};

export const loadEvaluations = (certId: string) => async (dispatch: ThunkDispatch<{}, {}, LoadEvaluationsAction>) => {
  let evaluations = await evaluation.getEvaluations(certId);

  dispatch({
    type: ActionType.LOAD_EVALUATIONS,
    payload: {
      evaluations,
    },
  });
};
