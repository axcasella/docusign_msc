import { defaultState as certificationDefaultState } from './certification'

export interface RootState {
  cert: typeof certificationDefaultState
}