"use strict";

function getEnv(keys) {
  const stringifiedEnv = {
    "process.env": keys.reduce((env, key) => {
      env[key] = JSON.stringify(process.env[key] || "development");
      return env;
    }, {})
  };
  return stringifiedEnv;
}
module.exports = getEnv;
