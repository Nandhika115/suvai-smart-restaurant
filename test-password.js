const crypto = require("crypto");

const password = "SuvaiAdmin@2026";

const salt = "912ae00894a13a4aeff1e6d59b85232d";

const hash = crypto
  .scryptSync(password, salt, 64)
  .toString("hex");

console.log(hash);