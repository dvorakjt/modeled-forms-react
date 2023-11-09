import { autowire } from 'undecorated-di';
import { AbstractDualField } from '../../../fields/base/abstract-dual-field';
import { AbstractField } from '../../../fields/base/abstract-field';
import { AsyncDualFieldStateControlFn } from '../../../fields/controlled/control-functions/dual-fields/async-dual-field-state-control-fn.type';
import { AsyncDualFieldValueControlFn } from '../../../fields/controlled/control-functions/dual-fields/async-dual-field-value-control-fn.type';
import { SyncDualFieldStateControlFn } from '../../../fields/controlled/control-functions/dual-fields/sync-dual-field-state-control-fn.type';
import { SyncDualFieldValueControlFn } from '../../../fields/controlled/control-functions/dual-fields/sync-dual-field-value-control-fn.type';
import { AsyncFieldStateControlFn } from '../../../fields/controlled/control-functions/fields/async-field-state-control-fn.type';
import { AsyncFieldValueControlFn } from '../../../fields/controlled/control-functions/fields/async-field-value-control-fn.type';
import { SyncFieldStateControlFn } from '../../../fields/controlled/control-functions/fields/sync-field-state-control-fn.type';
import { SyncFieldValueControlFn } from '../../../fields/controlled/control-functions/fields/sync-field-value-control-fn.type';
import {
  ControlledFieldFactory,
  ControlledFieldFactoryKey,
} from '../../../fields/controlled/controlled-field-factory.interface';
import { StateControlledDualField } from '../../../fields/controlled/state-controlled-dual-field';
import { StateControlledField } from '../../../fields/controlled/state-controlled-field';
import { ValueControlledDualField } from '../../../fields/controlled/value-controlled-dual-field';
import { ValueControlledField } from '../../../fields/controlled/value-controlled-field';
import { FormElementDictionary } from '../../../form-elements/form-element-dictionary.type';
import {
  ControlledFieldTemplateParser,
  ControlledFieldTemplateParserKey,
  ControlledFieldTemplateParserKeyType,
} from './controlled-field-template-parser.interface';
import { ControlledFieldTemplateParsingError } from './controlled-field-template-parsing-error.error';
import { ControlledFieldTemplateVariations } from './controlled-field-template-variations.type';

enum ControlType {
  SYNC_STATE_CONTROL_FN = 'syncStateControlFn',
  ASYNC_STATE_CONTROL_FN = 'asyncStateControlFn',
  SYNC_VALUE_CONTROL_FN = 'syncValueControlFn',
  ASYNC_VALUE_CONTROL_FN = 'asyncValueControlFn',
}

class ControlledFieldTemplateParserImpl
  implements ControlledFieldTemplateParser
{
  _controlledFieldFactory: ControlledFieldFactory;

  constructor(controlledFieldFactory: ControlledFieldFactory) {
    this._controlledFieldFactory = controlledFieldFactory;
  }

  parseTemplateAndDecorateField(
    baseField: AbstractField | AbstractDualField,
    template: ControlledFieldTemplateVariations,
    fields: FormElementDictionary,
  ):
    | StateControlledField
    | StateControlledDualField
    | ValueControlledField
    | ValueControlledDualField {
    if (!(baseField instanceof AbstractField)) {
      throw new ControlledFieldTemplateParsingError(
        'ControlledFieldTemplateParser expected instanceof AbstractField.',
      );
    }

    const controlFnType = this._getControlFnType(template);

    switch (controlFnType) {
      case ControlType.SYNC_STATE_CONTROL_FN:
        return this._controlledFieldFactory.createStateControlledFieldWithSyncAdapter(
          baseField,
          template.syncStateControlFn as
            | SyncFieldStateControlFn
            | SyncDualFieldStateControlFn,
          fields,
        );
      case ControlType.ASYNC_STATE_CONTROL_FN:
        return this._controlledFieldFactory.createStateControlledFieldWithAsyncAdapter(
          baseField,
          template.asyncStateControlFn as
            | AsyncFieldStateControlFn
            | AsyncDualFieldStateControlFn,
          fields,
        );
      case ControlType.SYNC_VALUE_CONTROL_FN:
        return this._controlledFieldFactory.createValueControlledFieldWithSyncAdapter(
          baseField,
          template.syncValueControlFn as
            | SyncFieldValueControlFn
            | SyncDualFieldValueControlFn,
          fields,
        );
      case ControlType.ASYNC_VALUE_CONTROL_FN:
        return this._controlledFieldFactory.createValueControlledFieldWithAsyncAdapter(
          baseField,
          template.asyncValueControlFn as
            | AsyncFieldValueControlFn
            | AsyncDualFieldValueControlFn,
          fields,
        );
    }
  }

  _getControlFnType(template: ControlledFieldTemplateVariations): ControlType {
    const controlTypes = Object.values(ControlType) as Array<ControlType>;
    let controlFnType: ControlType | null = null;
    for (const controlType of controlTypes) {
      if (
        controlType in template &&
        template[controlType as keyof typeof template]
      ) {
        if (controlFnType) {
          throw new ControlledFieldTemplateParsingError(
            'ControlledFieldTemplateParser received template containing multiple control functions. Please include only one control function type.',
          );
        }
        controlFnType = controlType as ControlType;
      }
    }
    if (!controlFnType)
      throw new ControlledFieldTemplateParsingError(
        'The template passed to ControlledFieldTemplateParser lacked a control function.',
      );

    return controlFnType;
  }
}

const ControlledFieldTemplateParserService = autowire<
  ControlledFieldTemplateParserKeyType,
  ControlledFieldTemplateParser,
  ControlledFieldTemplateParserImpl
>(ControlledFieldTemplateParserImpl, ControlledFieldTemplateParserKey, [
  ControlledFieldFactoryKey,
]);

export {
  ControlledFieldTemplateParserImpl,
  ControlledFieldTemplateParserService,
};
