const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const pool = require('./configs/dbConfig')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Handle trip GET route for all trips
app.get('/trip/', (req, res) => {
  const query = 'SELECT * FROM trip_light'
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const trips = [...results]
    const response = {
      data: trips,
      message: 'All trips successfully retrieved.',
    }
    res.send(response)
  })
})

// Handle trip GET route for specific trips
app.get('/trip/:id/:id_user', (req, res) => {
  const id_user = req.params.id_user
  const query = `SELECT * FROM trip_light WHERE id_user=${id_user}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const trips = [...results]
    const response = {
      data: trips,
      message: `Trips from id_user ${id_user} successfully retrieved.`,
    }
    res.send(response)
  })
})

// Handle trip POST route
app.post('/trip/', (req, res) => {
  const { 
    ts_start,
    ts_finish,
    time_seconds,
    max_speed,
    avg_speed,
    distance_meters,
    altitude,
    jumps_accumulated,
    safety,
    weather,
    weather_txt,
    date_trip,
    id_user,
    xp_gained,
    cheating,
    weatherTemperature,
    doubleCheck,
    fake,
    boostUsed,
    equipment,
    staticmap
   } = req.body
  const query = `
  INSERT INTO trip_light
  (ts_start,
    ts_finish,
    time_seconds,
    max_speed,
    avg_speed,
    distance_meters,
    altitude,
    jumps_accumulated,
    safety,
    weather,
    weather_txt,
    date_trip,
    id_user,
    xp_gained,
    cheating,
    weatherTemperature,
    doubleCheck,
    fake,
    boostUsed,
    equipment,
    staticmap)
  VALUES (
    '${ts_start}',
    '${ts_finish}',
    '${time_seconds}',
    '${max_speed}',
    '${avg_speed}',
    '${distance_meters}',
    '${altitude}',
    '${jumps_accumulated}',
    '${safety}',
    '${weather}',
    '${weather_txt}',
    '${date_trip}',
    '${id_user}',
    '${xp_gained}',
    '${cheating}',
    '${weatherTemperature}',
    '${doubleCheck}',
    '${fake}',
    '${boostUsed}',
    '${equipment}',
    '${staticmap}'
    )`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { insertId } = results
    const trip = {id: insertId, ts_start, ts_finish, time_seconds, max_speed, avg_speed, distance_meters, altitude, jumps_accumulated, safety, weather, weather_txt, date_trip, id_user, xp_gained,
    cheating, weatherTemperature, doubleCheck, fake, boostUsed, equipment, staticmap}
    const response = {
      data: trip,
      message: `Trip successfully added.`,
    }
    res.status(201).send(response)
  })
})

// Handle trip PUT route
app.put('/trip/:id', (req, res) => {
  const { id } = req.params
  const query = `SELECT * FROM trip_light WHERE id=${id} LIMIT 1`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { id, ts_start, ts_finish, time_seconds, max_speed, avg_speed, distance_meters, altitude, jumps_accumulated, safety, weather, weather_txt, date_trip, id_user, xp_gained,
      cheating, weatherTemperature, doubleCheck, fake, boostUsed, equipment, staticmap } = { ...results[0], ...req.body }
    const query = `
    UPDATE trip_light SET
    ts_start = '${ts_start}',
    ts_finish = '${ts_finish}',
    time_seconds = '${time_seconds}',
    max_speed = '${max_speed}',
    avg_speed = '${avg_speed}',
    distance_meters = '${distance_meters}',
    altitude = '${altitude}',
    jumps_accumulated = '${jumps_accumulated}',
    safety = '${safety}',
    weather = '${weather}',
    weather_txt = '${weather_txt}',
    date_trip = '${date_trip}',
    id_user = '${id_user}',
    xp_gained = '${xp_gained}',
    cheating = '${cheating}',
    weatherTemperature = '${weatherTemperature}',
    doubleCheck = '${doubleCheck}',
    fake = '${fake}',
    boostUsed = '${boostUsed}',
    equipment = '${equipment}',
    staticmap = '${staticmap}'
    WHERE id='${id}'`

    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response)
      }

      const trip = {
        id,
        ts_start,
        ts_finish,
        time_seconds,
        max_speed,
        avg_speed,
        distance_meters,
        altitude,
        jumps_accumulated,
        safety,
        weather,
        weather_txt,
        date_trip,
        id_user,
        xp_gained,
        cheating,
        weatherTemperature,
        doubleCheck,
        fake,
        boostUsed,
        equipment,
        staticmap,
      }

      const response = {
        data: trip,
        message: `Trip ${id} is successfully updated.`,
      }
      res.send(response)
    })
  })
})

// Handler trip DELETE route
app.delete('/trip/:id', (req, res) => {
  const { id } = req.params
  const query = `DELETE FROM trip_light WHERE id=${id}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message }
      res.send(response)
    }

    const response = {
      data: null,
      message: `Trip with id: ${id} successfully deleted.`,
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