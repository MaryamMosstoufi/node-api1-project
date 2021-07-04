const express = require("express");
const shortid = require("shortid"); 

const server = express();
server.use(express.json());

const port = 8000;

server.get("/hello", (req, res) => {
  res.send("hello world");
})

const initialUser = {
  id: "",
  name: "",
  bio: ""
}

const users = [];

// Get Users
server.get("/users", (req, res) => {
  try {
    res.status(200).json(users)
  }
  catch {
    res.status(500).json({ errorMessage: "The users information could not be retrieved." })
  }
})

// Post User
server.post("/users", (req, res) => {
  const user = req.body;
  
  if (user.name && user.bio) {
    user.id = shortid.generate();
    users.push(user);
    res.status(201).json(users);
  } else if (!user.name || !user.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
  }
})

// Get User By ID
server.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.filter(user => user.id === id);
  if (user && user.length > 0) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "The user with the specified ID does not exist." });
  }
})


// Delete User By ID
server.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.filter(user => user.id === id);
  const userIndex = users.findIndex(user => user.id === id);
  if (user.length > 0) {
    users.splice(userIndex, 1);
    res.status(204).end();
  } else if (user.length === 0){
    res.status(404).json({ message: "The user with the specified ID does not exist." });
  } else {
    res.status(500).json({ errorMessage: "The user could not be removed" });
  }
});

//Update User By ID
server.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.filter(user => user.id === id);
  const userIndex = users.findIndex(user => user.id === id);
  
  if (user.length > 0) {
    if (req.body.name && req.body.bio) {
      users[userIndex] = { ...users[userIndex], ...req.body, id: id }
      res.status(200).json(users[userIndex]);
    } else if (!req.body.name || !req.body.bio) {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
  } else {
    res.status(404).json({ errorMessage: "This user does not exist." })
  }
})

server.listen(port, () => console.log("server running..."));