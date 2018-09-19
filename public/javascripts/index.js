import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {

    axios.get(`/token`)
    .then((response) => {
        var token = response.data; 
        console.log(token)
    })
    .catch(function (error) {
        console.log(error);
    });

    
})
