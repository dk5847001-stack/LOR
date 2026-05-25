const crypto = require("crypto");

module.exports = () => {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `INT-LOR-${year}-${randomPart}`;
};
