const functions = require('firebase-functions');
const axios = require('axios');

class RecaptchaPostError extends Error {}
class RecaptchaDeniedError extends Error {}

const recaptchaVerify = async (token) => {
  const secret = functions.config().recaptcha.secret
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  try {
    const res = await axios.post(verifyUrl);
    const { success, score, action } = res.data;
    const verified = success && score > 0.75;
    if (!verified) {
      throw new RecaptchaDeniedError(`Recaptcha verification failed: success:${success}. score:${score}. action:${action}`);
    }
  } catch (e) {
    throw new RecaptchaPostError(e);
  }
};

exports.recaptchaVerify = recaptchaVerify;
