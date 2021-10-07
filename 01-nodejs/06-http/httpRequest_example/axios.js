const axios = require('axios').default;

axios.defaults.baseURL = 'https://api.github.com';

// async/await
async function requsetAPI() {
    try {
      const response = await axios.get('/repos/request/request');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
}
requsetAPI();

// Set config defaults when creating the instance
const instance = axios.create({ 
    baseURL: 'https://api.github.com'
});

instance.get('/repos/request/request', {
    timeout: 5000
}).then(function(response) {
    console.log(response.data);
});
