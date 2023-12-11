import { describe, test, expect, beforeEach } from 'vitest';
import { ExtractedValuesTemplateParserImpl } from '../../../../model/templates/extracted-values/extracted-values-template-parser-impl';
import { container } from '../../../../model/container';
import { FormElementDictionary } from '../../../../model/form-elements/form-element-dictionary.type';
import { MockField } from '../../../testing-util/mocks/mock-field';
import { Validity } from '../../../../model';
import { ExtractedValuesTemplateParser } from '../../../../model/templates/extracted-values/extracted-values-template-parser.interface';
import { ExtractedValuesTemplate } from '../../../../model/templates/extracted-values/extracted-values-template.interface';
import { SyncAdapter } from '../../../../model/adapters/sync-adapter';
import { AsyncAdapter } from '../../../../model/adapters/async-adapter';

describe('ExtractedValuesTemplateParserImpl', () => {
  let extractedValuesTemplateParser: ExtractedValuesTemplateParser;
  let fields: FormElementDictionary;

  beforeEach(() => {
    extractedValuesTemplateParser = new ExtractedValuesTemplateParserImpl(
      container.services.AdapterFactory,
    );

    fields = {
      favoriteColor: new MockField('', Validity.VALID_FINALIZABLE),
      favoriteFood: new MockField('', Validity.VALID_FINALIZABLE),
    };
  });

  test('It returns an empty ExtractedValueDictionary if both syncExtractedValues and asyncExtractedValues are undefined.', () => {
    const extractedValuesTemplate: ExtractedValuesTemplate = {};

    expect(
      extractedValuesTemplateParser.parseTemplate(
        extractedValuesTemplate,
        fields,
      ),
    ).toStrictEqual({});
  });

  test('It returns an empty ExtractedValueDictionary if both syncExtractedValues and asyncExtractedValues are empty objects.', () => {
    const extractedValuesTemplate: ExtractedValuesTemplate = {
      syncExtractedValues: {},
      asyncExtractedValues: {},
    };

    expect(
      extractedValuesTemplateParser.parseTemplate(
        extractedValuesTemplate,
        fields,
      ),
    ).toStrictEqual({});
  });

  test('It returns an ExtractedValueDictionary with the expected keys when syncExtractedValues contains keys.', () => {
    const complimentaryColors = {
      red: 'green',
      blue: 'orange',
      yellow: 'purple',
      green: 'red',
      orange: 'blue',
      purple: 'yellow',
    };

    const extractedValuesTemplate: ExtractedValuesTemplate = {
      syncExtractedValues: {
        favoriteColorCompliment: ({ favoriteColor }) => {
          if (!(favoriteColor.value in complimentaryColors)) {
            return 'favoriteColor is not a known color';
          }

          return complimentaryColors[
            favoriteColor.value as keyof typeof complimentaryColors
          ];
        },
      },
    };

    const extractedValues = extractedValuesTemplateParser.parseTemplate(
      extractedValuesTemplate,
      fields,
    );

    expect(extractedValues.favoriteColorCompliment).toBeInstanceOf(SyncAdapter);
  });

  test('It returns an ExtractedValueDictionary with the expected keys when asyncExtractedValues contains keys.', () => {
    const restaurantMenu = [
      'grilled tofu',
      'impossible burger',
      'vegetarian hoagie',
    ];

    const extractedValuesTemplate: ExtractedValuesTemplate = {
      asyncExtractedValues: {
        restaurantHasFavoriteFood: ({ favoriteFood }) => {
          return new Promise(resolve => {
            resolve(restaurantMenu.includes(favoriteFood.value));
          });
        },
      },
    };

    const extractedValues = extractedValuesTemplateParser.parseTemplate(
      extractedValuesTemplate,
      fields,
    );

    expect(extractedValues.restaurantHasFavoriteFood).toBeInstanceOf(
      AsyncAdapter,
    );
  });
});
