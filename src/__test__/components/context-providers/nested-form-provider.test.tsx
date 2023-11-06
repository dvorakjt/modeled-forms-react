import React from "react";
import { describe, test, expect, afterEach } from "vitest";
import { cleanup } from '@testing-library/react';
import { renderPossiblyErrantComponent } from "../../util/components/render-possibly-errant-component";
import { NestedFormProvider } from "../../../components";
import { MockFormContext } from "../../util/mocks/mock-form-context-provider";

describe('NestedFormProvider', () => {
  afterEach(cleanup);

  test('It throws an error when rendered outside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(<NestedFormProvider fieldName="myNestedForm" />);
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error when rendered inside of a FormContext.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <NestedFormProvider fieldName="myNestedForm" />
      </MockFormContext>
    )
    expect(errorDetected).toBe(false);
  });
});