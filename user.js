const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const pool = require('./configs/dbConfig')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Handle user GET route for all users
app.get('/user/', (req, res) => {
  const query = 'SELECT * FROM user'
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const users = [...results]
    const response = {
      data: users,
      message: 'All users successfully retrieved.',
    }
    res.send(response)
  })
})

// Handle user GET route for specific users
app.get('/user/:id', (req, res) => {
  const id = req.params.id
  const query = `SELECT * FROM user WHERE id=${id}`
  pool.query(query, (err, results, fields) => {
    if (err) {
        console.log(err.message)
    }

    if (results.lenght == 0)
    {
      const response = {data: null, message: `User doesn't exist.`, }   //{ data: null, message: err.message, }
      res.send(response)      
    } else {
        const user = results[0]
        const response = {
        data: user,
        message: `User ${user.name} successfully retrieved.`,
        }   
        res.status(200).send(response)        
        }
  })
})

// Handle user POST route
app.post('/user/', (req, res) => {
  const { name, email, os } = req.body

  const query = `INSERT INTO user (name, email, os) VALUES ('${name}', '${email}', '${os}')`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { insertId } = results
    const user = {id: insertId, name, email, os}
    const response = {
      data: user,
      message: `User ${name} successfully added.`,
    }
    res.status(201).send(response)
  })
})

// Handle user PUT route
app.put('/user/:id', (req, res) => {
  const { id } = req.params
  const query = `SELECT * FROM user WHERE id=${id} LIMIT 1`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { id, name, email, os } = { ...results[0], ...req.body }
    const query = `UPDATE user SET name='${name}', email='${email}', os='${os}' WHERE id='${id}'`
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response)
      }

      const user = {
        id,
        name,
        email,
        os,
      }
      const response = {
        data: user,
        message: `User ${name} is successfully updated.`,
      }
      res.send(response)
    })
  })
})

// Handler user DELETE route
app.delete('/user/:id', (req, res) => {
  const { id } = req.params
  const query = `DELETE FROM user WHERE id=${id}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message }
      res.send(response)
    }

    const response = {
      data: null,
      message: `User with id: ${id} successfully deleted.`,
    }
    res.send(response)
  })
})

// Handle in-valid route
app.all('*', function(req, res) {
  const response = { data: null, message: 'Route not found!!' }
  res.status(400).send(response)
})

// wrap express app instance with serverless http function
module.exports.handler = serverless(app)