import axios from "axios";

export const fetchToken = () => (
  axios.get(`/token`)
);

export const fetchAlbumImage = (songId, token) => (
  axios({
    method: 'get',
    url: '/albumImage',
    headers: {
      songId: songId,
      token: token
    }
  })
);

export const fetchTopPlaylist = (token) => (
  axios({
    method: 'get',
    url: '/topPlaylist',
    headers: {
      token
    }
  })
);