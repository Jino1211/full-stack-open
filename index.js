const express = require("express");
const app = express();
const Person = require("./module/person");

app.use(express.json());

app.use("/", express.static("./build"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "./index.html");
});

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((person) => {
      response.json(person);
    })
    .catch((e) => response.status(500).json({ ERROR: "Server Error" }));
});

app.get("/api/info", (request, response) => {
  const date = new Date().toLocaleString();
  Person.find({})
    .then((result) => {
      response.send(`${result.length} people. <br> ${date} `);
    })
    .catch((e) => response.status(500).json({ ERROR: "Server Error" }));
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
    .catch((e) => response.status(500).json({ ERROR: "Server Error" }));
});

app.delete("/api/persons/:id", validId, (request, response) => {
  const id = Number(request.params.id);

  Person.deleteOne({ id })
    .then(() => {
      response.status(204).end();
    })
    .catch((e) => response.status(500).json({ ERROR: "Server Error" }));
});

app.put("/api/persons/:id", validId, (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  const person = {
    id: id,
    number: req.body.number,
  };

  Person.updateOne({ id }, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((update) => {
      console.log("update success");
      res.status(200).json(update);
    })
    .catch((e) => console.log(e));
});

// function that find the max id and increase by one
function getRandomId(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.post("/api/persons/", isUnique, async (request, response) => {
  const { body } = request;
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
    .catch((e) => {
      if (e.name === "ValidationError") {
        return response.status(400).json({ ERROR: "Validation Error" });
      }
      return response.status(500).json({ ERROR: "Server Error" });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function validId(req, res, next) {
  const id = Number(req.params.id);

  if (isNaN(id)) return res.status(400).json({ ERROR: "Invalid ID" });

  next();
}

async function isUnique(req, res, next) {
  const { body } = req;
  try {
    const isUnique = await Person.find({ name: body.name });
    if (isUnique.length !== 0) {
      return response.status(400).json({ ERROR: "must be unique" });
    }
    next();
  } catch {
    return response.status(500).json({ ERROR: "server problem" });
  }
}
module.exports = getRandomId;
