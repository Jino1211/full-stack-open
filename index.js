const { response } = require("express");
const express = require("express");
const app = express();
app.use(express.json());

let phoneBook = [
  {
    id: 1,
    name: "eyal",
    number: "0501230773",
  },
  {
    id: 2,
    name: "yair",
    number: "0502340773",
  },
  {
    id: 3,
    name: "jino",
    number: "0506780773",
  },
  {
    id: 4,
    name: "gil",
    number: "0508880773",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phoneBook);
});

app.get("/api/info", (request, response) => {
  response.send(
    `PhoneBook has info for ${phoneBook.length} people <br/>${new Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phoneBook.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phoneBook = phoneBook.filter((person) => person.id !== id);

  response.status(204).end();
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

  if (phoneBook.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: getRandomId(phoneBook.length, 10000),
    name: body.name,
    number: body.number,
  };
  phoneBook.push(person);

  response.send(phoneBook);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
