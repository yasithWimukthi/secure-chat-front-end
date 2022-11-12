import hmacSHA512 from "crypto-js/hmac-sha512";

export const generateHmac = (message) => {
  const secret = process.env.REACT_APP_HMAC_SECRET;
  const hash = hmacSHA512(message, secret);
  return hash.toString();
};
