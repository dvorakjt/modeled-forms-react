import React from 'react';
import { describe, test, expect, afterEach } from "vitest";
import { render, cleanup, screen } from '@testing-library/react';
import { renderPossiblyErrantComponent } from "../../util/components/render-possibly-errant-component";
import { OmittableContent } from '../../../components/omittable-content/omittable-content.component';
import { MockFormContext } from '../../util/mocks/mock-form-context-provider';
import { FormContextType } from '../../../components/context-providers/form-context';
import { v4 as uuidv4 } from 'uuid';

describe('OmittableContent', () => {
  afterEach(cleanup);

  test('It throws an error if rendered outside of a FormContext provider.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <OmittableContent fieldName='someField'>test</OmittableContent>
    );
    expect(errorDetected).toBe(true);
  });

  test('It does NOT throw an error if rendered inside a FormContext provider.', () => {
    const { errorDetected } = renderPossiblyErrantComponent(
      <MockFormContext>
        <OmittableContent fieldName='someField'>test</OmittableContent>
      </MockFormContext>  
    );
    expect(errorDetected).toBe(true);
  });

  test('If the corresponding field is omitted, it returns null.', () => {
    const useOmittableFormElement = (() => {
      return {
        omitFormElement : true
      }
    }) as any;

    const mockCtxValue : Partial<FormContextType> = {
      useOmittableFormElement
    }

    const testId = uuidv4();

    render (
      <MockFormContext mockContextValue={mockCtxValue}>
        <OmittableContent fieldName='someField'>
          <div data-testid={testId}></div>
        </OmittableContent>
      </MockFormContext>
    );

    const conditionallyRenderedElement = screen.queryByTestId(testId);

    expect(conditionallyRenderedElement).toBeNull();
  });

  test('If the corresponding field is not omitted, it returns its child components.', () => {
    const useOmittableFormElement = (() => {
      return {
        omitFormElement : false
      }
    }) as any;

    const mockCtxValue : Partial<FormContextType> = {
      useOmittableFormElement
    }

    const testId = uuidv4();

    render (
      <MockFormContext mockContextValue={mockCtxValue}>
        <OmittableContent fieldName='someField'>
          <div data-testid={testId}></div>
        </OmittableContent>
      </MockFormContext>
    );

    const conditionallyRenderedElement = screen.queryByTestId(testId);

    expect(conditionallyRenderedElement).not.toBeNull();
  });
});