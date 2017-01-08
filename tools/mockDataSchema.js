export const schema = {
    type: 'object',
    properties: {
      accountNo: {
        type: 'array',
        minItems: 100,
        maxItems: 100,
        items: {
          $ref: '#/definitions/positiveInt',
          unique: true
        }
      },
      accountName: {
        type: 'array',
        minItems: 100,
        maxItems: 100,
        items: {
          type: 'string',
          faker: 'name.lastName',
          unique: true
        }
      },
      partyId: {
        type: 'array',
        minItems: 100,
        maxItems: 100,
        items: {
          type: 'integer',
          minimum: 9990,
          maximum: 9999
        }
      },
      partyName: {
        type: 'array',
        minItems: 100,
        maxItems: 100,
        items: {
          type: 'string',
          faker: {
            fake : '{{name.lastName}}, {{name.firstName}} {{name.suffix}}'
          }
        }
      },
      dateUpdated: {
        type: 'array',
        minItems: 100,
        maxItems: 100,
        items: {
          type: 'string',
          faker: {
            "date.between": ['2010-01-01', '2015-12-31']
          }
        }
      },
      isTaxResidence: {
        type: 'array',
        minItems: 100,
        maxItems: 100,
        items: {
          type: 'boolean',
          chance: 'bool'
        }
      },
      countryResidence: {
        type: 'array',
        minItems: 100,
        maxItems: 100,
        items: {
          type: 'string',
          chance: {
            pickone: [
              ['India','America','England']
            ]
          }
        }
      }
    },
    required: ['accountNo', 'accountName', 'partyId', 'partyName', 'dateUpdated',
                    'isTaxResidence', 'countryResidence'],
    definitions: {
      positiveInt: {
        type: 'integer',
        minimum: 1000000,
        maximum: 9999999
      }
    }
  }
  ;
