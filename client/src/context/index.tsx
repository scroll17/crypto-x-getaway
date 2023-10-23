import React from 'react';

import { Action, ACTION_TYPE, Dispatch, State } from './types';

const initialState: State = {
  authUser: null,
};

type StateContextProviderProps = { children: React.ReactNode };

const StateContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(
  undefined,
);

const stateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.SetUser: {
      return {
        ...state,
        authUser: action.payload,
      };
    }
    default: {
      throw new Error('Unhandled action type');
    }
  }
};

const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const [state, dispatch] = React.useReducer(stateReducer, initialState);
  const value = { state, dispatch };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

const useStateContext = () => {
  const context = React.useContext(StateContext);

  if (context) {
    return context;
  }

  throw new Error('useStateContext must be used within a StateContextProvider');
};

export { StateContextProvider, useStateContext };
