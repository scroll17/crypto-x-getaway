import { User } from '../api/types';

export enum ACTION_TYPE {
  SetUser = 'SET_USER',
}
export type State = {
  authUser: User | null;
};

export type Action = {
  type: ACTION_TYPE;
  payload: User | null;
};

export type Dispatch = (action: Action) => void;
