const axios = require('axios');

document.addEventListener('DOMContentLoaded', () => {

    axios.get(`/token`)
    .then((response) => {
        var token = response; 
    })
    .catch(function (error) {
        console.log(error);
    });

    
})
