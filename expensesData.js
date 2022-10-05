const fs = require("fs");

const getData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/expenses.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

const saveData = (expenses) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./data/expenses.json",
      JSON.stringify(expenses),
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve("Ok");
      }
    );
  });
};

module.exports = { getData, saveData };
