require("dotenv").config();
const uniqueValidator = require("mongoose-unique-validator");

const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 },
});

personSchema.plugin(uniqueValidator, { mas: "Error, invalid input" });
const Person = mongoose.model("Person", personSchema);

module.exports = Person;
