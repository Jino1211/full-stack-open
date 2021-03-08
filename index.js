const { response } = require("express");
const express = require("express");
const app = express();
const Person = require("./module/person");

app.use(express.json());

app.use("/", express.static(`./build`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./index.html");
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((person) => {
      response.json(person);
    })
    .catch((e) => res.status(500).json({ ERROR: "Server Error" }));
});

app.get("/api/info", (request, response) => {
  Person.find({})
    .then((result) => {
      response.send(
        `${result.length} people. <br> ${new Date().toLocaleString} `
      );
    })
    .catch((e) => res.status(500).json({ ERROR: "Server Error" }));
});

app.get("/api/persons/:id", validId, (request, response) => {
  const id = Number(request.params.id);
  Person.find({ id })
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).send("Not found");
      }
    })
    .catch((e) => res.status(500).json({ ERROR: "Server Error" }));
});

app.delete("/api/persons/:id", validId, (request, response) => {
  const id = Number(request.params.id);

  Person.remove({ id })
    .then((res) => {
      response.status(204).end();
    })
    .catch((e) => res.status(500).json({ ERROR: "Server Error" }));
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

  Person.find({ name: body.name })
    .then((person) => {
      if (person) {
        return response.status(400).json({ error: "name must be unique" });
      }
    })
    .catch((e) => res.status(500).json({ ERROR: "Server Error" }));

  const person = new Person({
    id: getRandomId(1, 10000),
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((res) => {
      response.json(res);
    })
    .catch((e) => res.status(500).json({ ERROR: "Server Error" }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function validId(req, res, next) {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ ERROR: "Invalid ID" });
    return;
  }
  next();
}

module.exports = getRandomId;
