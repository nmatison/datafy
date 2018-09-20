import axios from "axios";

export const fetchToken = () => (
  axios.get(`/token`)
);

export const fetchAlbumImage = (songId, token) => {
  console.log(songId)
  return axios({
    method: 'get',
    url: '/albumImage',
    headers: {
      songId: songId,
      token: token.data
    }
  });
};

export const fetchTopPlaylist = (token) => (
  axios({
    method: 'get',
    url: '/topPlaylist',
    headers: {
      token
    }
  })
);