const { response } = require("express");
const express = require("express");
const app = express();
const Person = require("./module/person");

app.use(express.json());

app.use("/", express.static(`./build`));

// let password = process.argv[2];
// const url = `mongodb+srv://fullstack:${password}@cluster0.2qkv2.mongodb.net/phoneBook?retryWrites=true&w=majority`;
// if (process.argv.length < 3) {
//   console.log(process.argv.length);
//   console.log(
//     "Please provide the password as an argument: node mongo.js <password>"
//   );
//   process.exit(1);
// }

// const person = new Person({
//   id: getRandomId(0, 10000),
//   name: process.argv[3],
//   number: process.argv[4],
// });

// if (!process.argv[3] && !process[4]) {
//   Person.find({}).then((result) => {
//     result.forEach((person) => {
//       console.log(person);
//     });
//     mongoose.connection.close();
//     process.exit(1);
//   });
// } else {
//   person.save().then((result) => {
//     console.log(`Added ${result} to phone book`);
//     mongoose.connection.close();
//   });
// }

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./index.html");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/info", (request, response) => {
  Person.find({}).then((result) => {
    response.send(`<div>${result.length} people.</div> <div> ${date} </div>`);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  Person.find({ id }).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).send("Not found");
    }
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  Person.remove({ id }).then((res) => {
    response.status(204).end();
  });
});

// function that find the max id and increase by one
function getRandomId(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.post("/api/persons/", (request, response) => {
  const { body } = request;

  if (!body) {
    return response.status(400).json({ error: "content missing" });
  }

  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  }

  if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }

  Person.find({ name: body.name }).then((person) => {
    if (person) {
      return response.status(400).json({ error: "name must be unique" });
    }
  });

  const person = new Person({
    id: getRandomId(0, 10000),
    name: body.name,
    number: body.number,
  });

  person.save().then((res) => {
    response.json(res);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = getRandomId;
