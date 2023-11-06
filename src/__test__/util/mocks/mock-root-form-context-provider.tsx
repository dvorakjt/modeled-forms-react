import React, { PropsWithChildren } from 'react';
import { RootFormContext, RootFormContextType } from '../../../components/context-providers/root-form-provider.component';
import { TrySubmitArgsObject } from '../../../model/submission/submission-manager.interface';

interface MockRootFormContextProps {
  mockContextValue? : Partial<RootFormContextType>
}

export function MockRootFormContext({ mockContextValue = {}, children } : PropsWithChildren<MockRootFormContextProps>) {
  const value : RootFormContextType = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    trySubmit : (argsObject : TrySubmitArgsObject) => {
      return;
    },
    ...mockContextValue
  }

  return (
    <RootFormContext.Provider value={value}>
      {children}
    </RootFormContext.Provider>
  )
}