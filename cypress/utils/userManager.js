const fs = require("fs");

function saveUser(user) {

  fs.writeFileSync(
    "cypress/fixtures/runtimeUser.json",
    JSON.stringify(user, null, 2)
  );

}

function getUser() {

  if (!fs.existsSync("cypress/fixtures/runtimeUser.json")) {
    return null;
  }

  return JSON.parse(
    fs.readFileSync(
      "cypress/fixtures/runtimeUser.json",
      "utf-8"
    )
  );

}

module.exports = {
  saveUser,
  getUser,
};