const Ajv = require('ajv');
const cl = require('countries-list');
const postalCodes = require('postal-codes-js');

const schema = require('./schema/commitment.schema');

const countriesList = cl.countries;

// TODO Package this as node package and host it on github packages so
// you don't need to copy it between frontend/ and functions/ subdirs

var ajv = new Ajv({ allErrors: true });

const countryCodeLookup = {};
Object.entries(countriesList).forEach(([code, data]) => {
  countryCodeLookup[data.name] = code;
});

// Given a commitmentData object, validate it and return a list of errors
const validate = commitmentData => {
  const { postalCode, country } = commitmentData;
  let errors = [];

  // Basic JSON validation: Name + Email
  const valid = ajv.validate(schema, commitmentData);
  if (!valid) {
    errors = errors.concat(ajv.errorsText());
  }

  // Country Validation
  const countries = Object.values(countriesList).map(c => c.name);

  // TODO: Will only need to do this serverside, as frontend countries will
  // be from a dropdown
  if (countries.indexOf(country) === -1) {
    errors.push(`Bad country: ${country}`);
  }

  const countryCode = countryCodeLookup[country];
  const pcResult = postalCodes.validate(countryCode, postalCode);
  if (pcResult !== true) {
    errors.push(pcResult);
  }

  return errors;
};

exports.validate = validate;
