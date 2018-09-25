const express = require('express')
// const router = express.Router();
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables
const formurlencoded = require("form-urlencoded").default;
const spotifyToken = require("./config/keys").token

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
      "Authorization": `${spotifyToken}`
    },
    body: data
  })
  .then((res) => {
    return res.text()
  })
  .then((body) => {
        let results = JSON.parse(body);
        var token = results.access_token;
        response.send(token) // sends to frontend
      });
  });

  app.get('/topPlaylist', (request, response) => {
    fetch(
      `https://api.spotify.com/v1/playlists/4hOKQuZbraPDIfaGbM3lKI/tracks?limit=25`,
      {
        headers: {
          Authorization: `Bearer ${request.headers.token}`
        }
      }
    ).then(res => {
      return res.text();
    }).then((body) => {
      let results = JSON.parse(body);
      parsedData = parsePlaylistData(results);
      response.send(parsedData);
    }
  )
});

app.get('/songInfo', (request, response) => {
  fetch(`https://api.spotify.com/v1/tracks/${request.headers.songid}`, {
    headers: {
      Authorization: `Bearer ${request.headers.token}`
    }
  })
  .then(res => {
    return res.text();
  })
  .then((body) => {
    let results = JSON.parse(body);
    let songInfo = getSongInfo(results);
    response.send(songInfo);
  })
  .catch((err) => {
    console.log(err);
  })
})

const parsePlaylistData = (results) => {
  let newData = [];
  results.items.forEach((item) => {
    let track = item.track;
    let artists = "";
    if (track.artists.length == 1) {
      artists = track.artists[0];
    } else {
      for (let i = 0; i < track.artists.length; i++) {
        if (i < track.artists.length - 1) {
          artists += `${track.artists[i].name}/`;
        } else {
          artists += artists[i].name;
        }
      };
    }
    let trackData = {
      track: track.name,
      artists: artists,
      URL: track.external_urls.spotify,
      album_image: "https://i.scdn.co/image/b923e1b7bb8130e96a0a50d5935c9d35af2b5a9d"
    };
    newData.push(trackData)
  });
  return newData
}

const getSongInfo = (results) => {
  return {
    albumImage: results.album.images[1].url,
    albumName: results.album.name,
    releaseDate: results.album.release_date,
    artist: results.album.artists[0].name,
    explicit: results.explicit,
    popularity: results.popularity,
  }
}
  
  app.use(express.static('public'))
  
  app.get('/', (request, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
  })
  
  app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})
