const axios = require('axios');

const api = axios.create({
	baseURL: process.env.SERVER_URL,
	headers: { "Access-Control-Allow-Origin": "*" }
});

module.exports.api = api;