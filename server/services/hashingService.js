const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.generateHash = (plainTextPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(plainTextPassword, saltRounds)
      .then((hash) => {
        resolve(hash);
      })
      .catch(reject);
  });
};

exports.validateHash = (plainTextPassword, passwordHash) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .compare(plainTextPassword, passwordHash)
      .then((result) => {
        resolve(result);
      })
      .catch(reject);
  });
};
