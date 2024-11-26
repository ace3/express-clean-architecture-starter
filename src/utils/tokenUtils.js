const crypto = require('crypto');

function generateSignature(secret) {
  const unixTs = Math.floor(Date.now() / 1000);
  const ts = unixTs - (unixTs % 30); // Round down to the nearest 30 seconds
  const message = ts.toString();
  const hmac = crypto.createHmac('sha256', secret).update(message).digest('hex');
  return hmac;
}

function isSignatureExpired(signatureTimestamp) {
  const currentTs = Math.floor(Date.now() / 1000);
  const difference = currentTs - signatureTimestamp;
  return difference > 30; // Signature valid for 30 seconds
}
module.exports = { generateSignature,isSignatureExpired };
