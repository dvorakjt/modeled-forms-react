import { describe, test, expect } from 'vitest';
import { copyObject } from '../../../model/util/copy-object';

describe('copyObject', () => {
  test('It copies an object.', () => {
    const originalObject = {
      foo : 'bar',
      baz : 1
    }
    const copiedObject = copyObject(originalObject);
    expect(copiedObject).toStrictEqual(originalObject);
  });

  test('It copies an array.', () => {
    const originalArray = [
      1, 2, 3
    ];
    const copiedArray = copyObject(originalArray);
    expect(copiedArray).toStrictEqual(originalArray);
  });

  test('It copies a deeply nested object.', () => {
    const deeplyNestedObject = getDeeplyNestedObject();
    const copiedObject = copyObject(deeplyNestedObject)
    expect(copiedObject).toStrictEqual(deeplyNestedObject);
  });

  test('Modifiying the copied object has no effect on the original.', () => {
    const deeplyNestedObject = getDeeplyNestedObject();
    const copiedObject = copyObject(deeplyNestedObject);
    copiedObject.foo.bar.baz = [3, 2, 1];
    copiedObject.foo.qux.quux = 'grault';
    expect(deeplyNestedObject).toStrictEqual(getDeeplyNestedObject());
  });

  function getDeeplyNestedObject() {
    return {
      foo : {
        bar : {
          baz : [
            1, 2, 3
          ]
        },
        qux : {
          quux : 'corge'
        }
      }
    }
  }
});