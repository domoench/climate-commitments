module.exports = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'http://example.com/commitment.schema.json',
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
  },
  required: ['email'],
};
