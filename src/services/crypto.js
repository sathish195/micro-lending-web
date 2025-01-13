import CryptoJS from "crypto-js";

var [password, salt] = [
  process.env.REACT_APP_CRYPTO_PASS,
  process.env.REACT_APP_CRYPTO_SALT,
];

var key = CryptoJS.PBKDF2(password, salt, {
  keySize: 256 / 32,
  iterations: 100,
});

const helpers = {
  encrypt: function (text) {
    try {
      return CryptoJS.AES.encrypt(text, key.toString()).toString();
    } catch (error) {
      return error;
    }
  },

  encryptobj: function (obj) {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(obj),
        key.toString()
      ).toString();
    } catch (error) {
      return error;
    }
  },

  decrypt: function (encdata) {
    try {
      const datat = CryptoJS.AES.decrypt(encdata, key.toString());
      return datat.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return error;
    }
  },

  decryptobj: function (encdata) {
    try {
      const datatt = CryptoJS.AES.decrypt(encdata, key.toString());
      return JSON.parse(datatt.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      return error;
    }
  },

};

export default helpers;
