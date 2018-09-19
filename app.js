const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables

app.use(express.static('public'))

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

// create route to get single book by its isbn
app.get('/token', (request, response) => {
  // make api call using fetch
  fetch(`https://accounts.spotify.com/api/token`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application / x-www-form-urlencoded",
      "Authorization": "Basic OWJiZmU1NDY2YmNmNDBmMWFjZTA5ZDE1NjQyODIyNGM6ZjhlYzBiNTZjMjQwNDc5NDk4ZjBjMzQ0NjA1MTc3MGE="
    }
  })
  .then((response) => {
      return response.access_token;
  }).then((body) => {
      let results = JSON.parse(body)
      console.log(results)   // logs to server
      response.send(results) // sends to frontend
    });
});


app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})
