import { render } from "@testing-library/react";
import { v4 as uuidv4 } from 'uuid'; 
import React from 'react';

export function renderErrantHook(hook : any) {
  const uniqueId = uuidv4();

  const { queryByTestId } = render(<ErrantHookWrapper hook={hook} uniqueId={uniqueId} />);

  const errorDetectionElement = queryByTestId(uniqueId);

  return {
    errorDetected : Boolean(errorDetectionElement)
  }
}

interface ErrantHookWrapperProps {
  hook : any,
  uniqueId : string
}

function ErrantHookWrapper({ hook, uniqueId } : ErrantHookWrapperProps) {
  let errorDetected = false;

  try {
    hook();
  } catch(e) {
    errorDetected = true;
  }

  return errorDetected ? <div data-testid={uniqueId}></div> : null;
}