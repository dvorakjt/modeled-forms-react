import React, { PropsWithChildren, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { render, screen, cleanup } from '@testing-library/react';

export function renderPossiblyErrantComponent(Component : ReactNode) {
  const uniqueId = uuidv4();

  let errorDetected = false;

  window.addEventListener('error', (e) => e.preventDefault());
  
  try {
    render(
      <TestErrorBoundary uniqueId={uniqueId}>
        {Component}
      </TestErrorBoundary>
    );
  } finally {
    errorDetected = Boolean(screen.queryByTestId(uniqueId));

    window.removeEventListener('error', (e) => e.preventDefault());
    cleanup();
  }

  return {
    errorDetected
  }
}

interface TestErrorBoundaryProps {
  uniqueId : string;
}

interface TestErrorBoundaryState {
  errorDetected : boolean;
}

class TestErrorBoundary extends React.Component<PropsWithChildren<TestErrorBoundaryProps>, TestErrorBoundaryState> {
  constructor(props : PropsWithChildren<TestErrorBoundaryProps>) {
    super(props);
    this.state = { errorDetected : false };
  }

  componentDidCatch() {
    this.setState({ errorDetected : true });
  }
  render() {
    return this.state.errorDetected ? <div data-testid={this.props.uniqueId}></div> : this.props.children;
  }
}