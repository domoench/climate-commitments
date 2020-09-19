const Ajv = require('ajv');
const cl = require('countries-list');
const postalCodes = require('postal-codes-js');

const schema = require('./schema/commitment.schema');

const countriesList = cl.countries;

// TODO Package this as node package and host it on github packages so
// you don't need to copy it between frontend/ and functions/ subdirs

var ajv = new Ajv({ allErrors: true, verbose: true });

const countryCodeLookup = {};
Object.entries(countriesList).forEach(([code, data]) => {
  countryCodeLookup[data.name] = code;
});

// Given a commitmentData object, validate it and return a list of errors
const validate = commitmentData => {
  const { postalCode, country } = commitmentData;

  // errors is a hash of error messages for each field key
  let errors = {};

  // Basic JSON validation: Name + Email
  const valid = ajv.validate(schema, commitmentData);
  if (!valid) {
    ajv.errors.forEach(error => {
      const key = error.dataPath.substring(1) // Strip off the '.' prefix
      errors[key] = error.message;
    })
  }

  // Country Validation
  const countries = Object.values(countriesList).map(c => c.name);

  if (countries.indexOf(country) === -1) {
    errors.country = `Bad country: ${country}`;
  }

  // If a country has been selected, we can validate the postalCode
  const countryCode = countryCodeLookup[country];
  if (countryCode) {
    const pcResult = postalCodes.validate(countryCode, postalCode);
    if (pcResult !== true) {
      errors.postalCode = pcResult;
    }
  }

  return errors;
};

exports.validate = validate;
