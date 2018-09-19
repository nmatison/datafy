const express = require('express')
const router = express.Router();
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables
const formurlencoded = require("form-urlencoded").default;

// create route to get single book by its isbn
app.get('/token', (request, response) => {
  // make api call using fetch
  let data = formurlencoded({
    "grant_type": "client_credentials"
  })
  fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic OWJiZmU1NDY2YmNmNDBmMWFjZTA5ZDE1NjQyODIyNGM6ZjhlYzBiNTZjMjQwNDc5NDk4ZjBjMzQ0NjA1MTc3MGE="
    },
    body: data
  })
  .then((res) => {
    return res.text()
  })
  .then((body) => {
        let results = JSON.parse(body)
        let token = results.access_token
        console.log(token)   // logs to server
        response.send(token) // sends to frontend
      });
  });
  
  app.use(express.static('public'))
  
  app.get('/', (request, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
  })
  
  app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})
