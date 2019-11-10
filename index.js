const express = require('express')
const cors = require('cors')
const database = require('./data/db')
const server = express()

server.use(express.json())
server.use(cors())

// GET REQUESTS
server.get('/', (req, res) => {
  res.send('Hello from Express')
})

server.get('/api/users', (req, res) => {
  database.find()
    .then(data => {
      res.status(200).json(data)
    })
    .catch(() => {
      return res.status(500).json({
        error: "The users information could not be retrieved."
      })
    })
})

server.get('/api/users/:id', (req, res) => {
  database.findById(req.params.id)
    .then(data => {
      return data 
      ? res.status(200).json(data)
      : res.status(404).json({
        message: "The user with the specified ID does not exist."
      })
    })
    .catch(() => {
      return res.status(500).json({
        error: "The user information could not be retrieved."
      })
    })
})

// DELTE REQUESTS
server.delete('/api/users/:id', (req, res) => {
  database.remove(req.params.id)
    .then(data => {
      return data !== 0
        ? res.status(200).json({ message: "Success!" })
        : res.status(404).json({
          message: "The user with the specified ID does not exist."
        })
      })
    .catch(() => {
      return res.status(500).json({
        error: "The user could not be removed."
      })
    })
})

// UPDATE REQUESTS
server.put('/api/users/:id', (req, res) => {
  if (!req.body.name || req.body.bio) {
    return res.status(400).json({
      error: "Okease provide name and bio for the user."
    })
  }
  database.update(req.body)
    .then(data => {
      return data !== 0
      ? res.status(200).json({ ...data, ...req.body })
      : res.status(404).json({
        message: "The user with the specified ID does not exist."
      })
    })
    .catch(() => {
      return res.status(500).json({
        error: "The user information could not be modified."
      })
    })
})

//CREATE REQUESTS
server.get('/api/users', (req, res) => {
  if (!req.body.name || !req.body.bio) {
    return res.status(400).json({
      error: "Please provide name and bio of the user."
    })
  }
  database.insert(req.body)
    .then(data => {
      res.status(200).json({ ...data, ...req.body})
    })
    .catch(() => {
      return res.status(500).json({
        error: "There was an error while saving the user to the database."
      })
    })
})

server.listen(process.env.PORT || 5000, () => {
  console.log("Server listening on" + (process.env.PORT || 5000))
})