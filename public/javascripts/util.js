import axios from "axios";

export const fetchToken = () => (
  axios.get(`/token`)
);

export const fetchSongInfo = (songId, token) => (
  axios({
    method: 'get',
    url: '/songInfo',
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