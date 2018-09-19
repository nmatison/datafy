import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {

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
})
