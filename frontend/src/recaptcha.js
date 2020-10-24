// As far as I can tell there's no canonical way to get the recpatcha API
// via npm, so we have to dynamically load the script
const loadRecaptcha = () => {
  const siteKey = process.env.RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    console.error('Missing recaptcha site key');
  }

  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
  document.body.appendChild(script);
};

export default loadRecaptcha;
