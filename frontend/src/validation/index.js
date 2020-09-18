const Ajv = require('ajv');
const cl = require('countries-list');
const postalCodes = require('postal-codes-js');

const schema = require('./schema/commitment.schema');

const countriesList = cl.countries;

/* TODO
 * - Now: Move this module up to parent directory to be shared between
 *   frontend and funcitons (server). Dumb way to do that is a git commit
 *   pre-hook that checks if the 3 versions are in sync.
 * - Later: Package it as node package and host it on github packages
 */

var ajv = new Ajv();
var validator = ajv.compile(schema);

const countryCodeLookup = {};
Object.entries(countriesList).forEach(([code, data]) => {
  countryCodeLookup[data.name] = code;
});

// Given a commitmentData object, validate it and return a list of errors
const validate = commitmentData => {
  const { postalCode, country } = commitmentData;
  let errors = [];

  // Basic JSON validation: Name + Email
  const valid = validator(commitmentData);
  if (!valid) {
    errors = errors.concat(validator.errors);
  }

  // Country Validation
  const countries = Object.values(countriesList).map(c => c.name);

  // TODO: Will only need to do this serverside, as frontend countries will
  // be from a dropdown
  console.log('countries', countries);
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
