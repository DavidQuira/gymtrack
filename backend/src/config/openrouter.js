const axios = require('axios');

console.log(process.env.OPENROUTER_API_KEY);

const openRouter = axios.create({
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
    }
});

module.exports = openRouter;