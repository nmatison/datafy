import axios from "axios";

export const fetchAlbumImage = (songId, token) => {
  return axios({
    method: 'get',
    url: '/albumImage',
    headers: {
      songId: songId,
      token: token
    }
  });
};

// export const 

axios.get(`/token`)
  .then((response) => {
    var token = response.data;
    return token
  })
  .then((token) => {
    console.log(token)
    axios({
      method: 'get',
      url: '/topPlaylist',
      headers: {
        token
      }
    })
      .then((response) => {
        console.log(response)
      })
  })
  .catch(function (error) {
    console.log(error);
  });