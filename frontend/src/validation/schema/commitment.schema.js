const cl = require('countries-list');

const countries = Object.values(cl.countries).map(c => c.name);

// TODO enumerate allowed country values?
module.exports = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/commitment.schema.json',
  title: 'Commitment',
  description: 'A user commitments submission',
  type: 'object',
  properties: {
    name: {
      description: "The user's name",
      type: 'string',
    },
    email: {
      description: "The user's email",
      type: 'string',
      format: 'email',
    },
    postalCode: {
      description: "The user's postal code",
      type: 'string',
    },
    country: {
      description: "The user's country",
      type: 'string',
      enum: countries,
    },
    commitments: {
      type: 'object',
      properties: {
        callBank: {
          type: 'boolean',
        },
        callRep: {
          type: 'boolean',
        },
        talk: {
          type: 'boolean',
        },
        participate: {
          type: 'boolean',
        },
        divestment: {
          type: 'boolean',
        },
      },
      required: ['callBank', 'callRep', 'talk', 'participate', 'divestment'],
      additionalProperties: false,
    },
    additionalProperties: false,
  },
  required: ['email', 'country', 'commitments'],
};
