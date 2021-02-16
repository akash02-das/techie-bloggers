const { body } = require("express-validator");
const cheerio = require("cheerio");

module.exports = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title can not be empty")
    .isLength({ max: 100 })
    .withMessage("Title can not be more than 100 characters")
    .trim(),

  body("body")
    .not()
    .isEmpty()
    .withMessage("Body can not be empty")
    .custom((value) => {
      let node = cheerio(value);
      let text = node.text();

      if (text.length > 5000) {
        throw new Error("Body can not be more than 5000 characters");
      }
      return true;
    }),
];
