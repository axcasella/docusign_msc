import { ActionType } from './';
import {
  AllActionTypes,
  CompleteStepAction,
  SetCurrentStepAction,
  LoadCertificationAction,
  LoadEvaluationsAction,
} from './types';
import defaultState from './defaultState';

export default function (state = defaultState, action: AllActionTypes) {
  switch (action.type) {
    case ActionType.COMPLETE_STEP:
      return {
        ...state,
        steps: {
          ...state.steps,
          [(action as CompleteStepAction).payload.step]: true,
        },
      };
    case ActionType.SET_STEP_ROUTES:
      return {
        ...state,
        routes: {
          ...state.routes,
          ...action.payload,
        },
      };
    case ActionType.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: (action as SetCurrentStepAction).payload.step,
      };
    case ActionType.LOAD_CERTIFICATION:
      return {
        ...state,
        activeCertificate: (action as LoadCertificationAction).payload.cert,
      };
    case ActionType.LOAD_EVALUATIONS:
      return {
        ...state,
        evaluations: (action as LoadEvaluationsAction).payload.evaluations,
      };
    default:
      return state;
  }
}
